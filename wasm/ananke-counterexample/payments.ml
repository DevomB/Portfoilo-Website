(* A card-payment workflow as an Ananke domain.

   Accounts hold available funds and funds on hold. A payment is authorized
   (funds move from the payer's balance to their hold), captured in one or
   more parts (hold → payee), refunded in parts (payee → payer) and finally
   voided (whatever is still on hold goes back to the payer). Every
   money-moving command carries an idempotency key: a redelivered command is
   acknowledged and ignored.

   The bug is planted and it is the classic one: when a payment is voided
   after a partial capture, the buggy variant releases the whole
   authorization instead of what is still on hold. The payer gets back money
   the payee already received. Conservation of money still holds — both
   sides of the release are the payer's own columns — which is exactly why a
   naive "money in = money out" check never catches it; the hold-ledger
   invariant does.

   The domain is pure: transition threads the runtime's RNG through
   unchanged and never touches a clock. *)

module Domain_ = Domain
open Base

type account =
  { balance : int
  ; held : int
  }
[@@deriving sexp, compare]

type payment =
  { payer : string
  ; payee : string
  ; authorized : int
  ; captured : int
  ; refunded : int
  ; closed : bool
  }
[@@deriving sexp, compare]

type state =
  { accounts : account Map.M(String).t
  ; payments : payment Map.M(String).t
  ; keys : Set.M(String).t
  ; minted : int
  }
[@@deriving sexp, compare]

type command =
  | Open_account of { name : string; balance : int }
  | Authorize of { key : string; payment : string; payer : string; payee : string; amount : int }
  | Capture of { key : string; payment : string; amount : int }
  | Refund of { key : string; payment : string; amount : int }
  | Void of { key : string; payment : string }
[@@deriving sexp]

type event =
  | Account_opened of string * int
  | Authorized of string * int
  | Captured of string * int
  | Refunded of string * int
  | Voided of string * int
  | Duplicate_ignored of string
[@@deriving sexp]

let initial_state =
  { accounts = Map.empty (module String)
  ; payments = Map.empty (module String)
  ; keys = Set.empty (module String)
  ; minted = 0
  }
;;

let key_of = function
  | Open_account _ -> None
  | Authorize { key; _ } | Capture { key; _ } | Refund { key; _ } | Void { key; _ } -> Some key
;;

(* ── invariants: what must be true of every state ─────────────────────── *)

let violation name message = Error { Violation.name; message }

let holds_non_negative state =
  match Map.to_alist state.accounts |> List.find ~f:(fun (_, a) -> a.held < 0) with
  | None -> Ok ()
  | Some (name, a) -> violation "holds_non_negative" (Printf.sprintf "%s has %d on hold" name a.held)
;;

let balances_non_negative state =
  match Map.to_alist state.accounts |> List.find ~f:(fun (_, a) -> a.balance < 0) with
  | None -> Ok ()
  | Some (name, a) -> violation "balances_non_negative" (Printf.sprintf "%s has balance %d" name a.balance)
;;

(** Each account's hold must equal what its open payments still have authorized but uncaptured. *)
let holds_match_open_payments state =
  let expected =
    Map.fold state.payments ~init:(Map.empty (module String)) ~f:(fun ~key:_ ~data acc ->
      if data.closed
      then acc
      else Map.update acc data.payer ~f:(fun v -> Option.value v ~default:0 + (data.authorized - data.captured)))
  in
  match
    Map.to_alist state.accounts
    |> List.find ~f:(fun (name, a) -> a.held <> Option.value (Map.find expected name) ~default:0)
  with
  | None -> Ok ()
  | Some (name, a) ->
    violation
      "holds_match_open_payments"
      (Printf.sprintf
         "%s holds %d but open payments account for %d"
         name
         a.held
         (Option.value (Map.find expected name) ~default:0))
;;

let captures_within_authorization state =
  match
    Map.to_alist state.payments
    |> List.find ~f:(fun (_, p) -> p.captured > p.authorized || p.refunded > p.captured)
  with
  | None -> Ok ()
  | Some (id, p) ->
    violation
      "captures_within_authorization"
      (Printf.sprintf "%s: authorized %d captured %d refunded %d" id p.authorized p.captured p.refunded)
;;

let money_conserved state =
  let total = Map.fold state.accounts ~init:0 ~f:(fun ~key:_ ~data acc -> acc + data.balance + data.held) in
  if total = state.minted
  then Ok ()
  else violation "money_conserved" (Printf.sprintf "accounts total %d but %d was minted" total state.minted)
;;

let invariants =
  [ "holds_non_negative", holds_non_negative
  ; "holds_match_open_payments", holds_match_open_payments
  ; "balances_non_negative", balances_non_negative
  ; "captures_within_authorization", captures_within_authorization
  ; "money_conserved", money_conserved
  ]
;;

(* ── the domain, in two variants ───────────────────────────────────────── *)

module type FIX = sig
  val void_releases_only_the_remainder : bool
end

module Make (Fix : FIX) :
  Domain_.S with type state = state and type command = command and type event = event = struct
  type nonrec state = state
  type nonrec command = command
  type nonrec event = event

  let name = if Fix.void_releases_only_the_remainder then "payments_fixed" else "payments"
  let version = 1
  let initial_state = initial_state
  let invariants = invariants
  let sexp_of_state = sexp_of_state
  let state_of_sexp = state_of_sexp
  let compare_state = compare_state
  let sexp_of_command = sexp_of_command
  let command_of_sexp = command_of_sexp
  let sexp_of_event = sexp_of_event
  let event_of_sexp = event_of_sexp
  let invalid fmt = Printf.ksprintf (fun m -> Error (Ananke_error.Invalid_command m)) fmt

  let account state name =
    match Map.find state.accounts name with
    | Some a -> Ok a
    | None -> invalid "no account %s" name
  ;;

  let payment state id =
    match Map.find state.payments id with
    | Some p -> Ok p
    | None -> invalid "no payment %s" id
  ;;

  let set_account state name a = { state with accounts = Map.set state.accounts ~key:name ~data:a }
  let set_payment state id p = { state with payments = Map.set state.payments ~key:id ~data:p }
  let ( let* ) = Result.( >>= )

  (* every keyed command is idempotent: a redelivery is acknowledged, not applied *)
  let keyed state key f =
    if Set.mem state.keys key
    then Ok (state, [ Duplicate_ignored key ])
    else f { state with keys = Set.add state.keys key }
  ;;

  let apply state = function
    | Open_account { name; balance } ->
      if balance < 0
      then invalid "opening balance must be non-negative"
      else if Map.mem state.accounts name
      then invalid "account %s already exists" name
      else
        Ok
          ( { (set_account state name { balance; held = 0 }) with minted = state.minted + balance }
          , [ Account_opened (name, balance) ] )
    | Authorize { key; payment = id; payer; payee; amount } ->
      keyed state key (fun state ->
        let* from = account state payer in
        let* _to = account state payee in
        if amount <= 0
        then invalid "amount must be positive"
        else if String.equal payer payee
        then invalid "payer and payee must differ"
        else if Map.mem state.payments id
        then invalid "payment %s already exists" id
        else if from.balance < amount
        then invalid "%s has %d, cannot authorize %d" payer from.balance amount
        else (
          let state = set_account state payer { balance = from.balance - amount; held = from.held + amount } in
          let state =
            set_payment state id { payer; payee; authorized = amount; captured = 0; refunded = 0; closed = false }
          in
          Ok (state, [ Authorized (id, amount) ])))
    | Capture { key; payment = id; amount } ->
      keyed state key (fun state ->
        let* p = payment state id in
        let* from = account state p.payer in
        let* to_ = account state p.payee in
        if p.closed
        then invalid "payment %s is closed" id
        else if amount <= 0 || amount > p.authorized - p.captured
        then invalid "payment %s has %d left to capture, not %d" id (p.authorized - p.captured) amount
        else (
          let state = set_account state p.payer { from with held = from.held - amount } in
          let state = set_account state p.payee { to_ with balance = to_.balance + amount } in
          let state = set_payment state id { p with captured = p.captured + amount } in
          Ok (state, [ Captured (id, amount) ])))
    | Refund { key; payment = id; amount } ->
      keyed state key (fun state ->
        let* p = payment state id in
        let* from = account state p.payee in
        let* to_ = account state p.payer in
        if amount <= 0 || amount > p.captured - p.refunded
        then invalid "payment %s has %d refundable, not %d" id (p.captured - p.refunded) amount
        else if from.balance < amount
        then invalid "%s has %d, cannot refund %d" p.payee from.balance amount
        else (
          let state = set_account state p.payee { from with balance = from.balance - amount } in
          let state = set_account state p.payer { to_ with balance = to_.balance + amount } in
          let state = set_payment state id { p with refunded = p.refunded + amount } in
          Ok (state, [ Refunded (id, amount) ])))
    | Void { key; payment = id } ->
      keyed state key (fun state ->
        let* p = payment state id in
        let* from = account state p.payer in
        if p.closed
        then invalid "payment %s is already closed" id
        else (
          (* THE BUG: the buggy variant releases the whole authorization,
             forgetting the part that was already captured and paid out *)
          let release =
            if Fix.void_releases_only_the_remainder then p.authorized - p.captured else p.authorized
          in
          let state = set_account state p.payer { balance = from.balance + release; held = from.held - release } in
          let state = set_payment state id { p with closed = true } in
          Ok (state, [ Voided (id, release) ])))
  ;;

  let transition state rng command =
    match apply state command with
    | Error _ as e -> e
    | Ok (state, events) -> Ok (state, events, rng)
  ;;
end
