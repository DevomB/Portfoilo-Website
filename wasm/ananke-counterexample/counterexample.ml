(* JavaScript surface of the Counterexample bridge (js_of_ocaml).
   Strings in, JSON strings out; commands travel as sexp text, one per line. *)

open Js_of_ocaml

let () =
  Js.export
    "ananke"
    (object%js
       method version = Js.string Bridge.version

       method scenario (seed : int) (length : int) = Js.string (Bridge.scenario_json ~seed ~length)

       method run (domain : Js.js_string Js.t) (commands : Js.js_string Js.t) =
         Js.string (Bridge.run_json (Js.to_string domain) (Js.to_string commands))

       method minimize (domain : Js.js_string Js.t) (commands : Js.js_string Js.t) =
         Js.string (Bridge.minimize_json (Js.to_string domain) (Js.to_string commands))

       method branch
           (domain : Js.js_string Js.t)
           (prefix : Js.js_string Js.t)
           (baseline : Js.js_string Js.t)
           (alternate : Js.js_string Js.t) =
         Js.string
           (Bridge.branch_json
              (Js.to_string domain)
              (Js.to_string prefix)
              (Js.to_string baseline)
              (Js.to_string alternate))
    end)
;;
