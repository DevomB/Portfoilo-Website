//! pallas-arena: the Adversarial Tape's engine, compiled to `wasm32-wasip1`.
//!
//! This is Athena's Pallas — the published `athenas-pallas` crate — running
//! unmodified in the browser. The page writes a tape to an in-memory WASI
//! filesystem at `/tape.csv`; the engine's own CSV loader, replay runner,
//! paper execution and report code do everything else. The only code here is
//! (1) three textbook strategies written against the engine's `Strategy`
//! trait, its documented extension point, and (2) a C ABI to pass JSON in and
//! out of linear memory.
//!
//! ABI:
//!   alloc(len) -> ptr              caller-owned buffer for the request JSON
//!   run(ptr, len) -> (ptr<<32|len) response JSON; free with dealloc(ptr, len)
//!   dealloc(ptr, len)
//!
//! Request:  { "strategy": "sma_cross" | "momentum" | "mean_revert" | "buy_and_hold",
//!             "params": { "fast": 10, "slow": 30, "lookback": 20, "qty": 10 },
//!             "initial_balance": 10000, "data_path": "/tape.csv" }
//! Response: { "ok": true, "report": <the engine's BacktestReport, verbatim> }
//!        or { "ok": false, "error": "..." }

use std::collections::HashMap;
use std::path::PathBuf;

use athenas_pallas::backtest::runner::BacktestRunner;
use athenas_pallas::backtest::{BacktestConfig, DataFormat};
use athenas_pallas::events::{Event, OrderIntent, OrderIntentSource, OrderType, Side, TimeInForce};
use athenas_pallas::instrument::Asset;
use athenas_pallas::strategy::{BuyAndHold, Strategy, StrategyContext};
use athenas_pallas::InstrumentId;
use rust_decimal::prelude::{FromPrimitive, ToPrimitive};
use rust_decimal::Decimal;
use serde::Deserialize;

// ── request ───────────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct Params {
    #[serde(default = "d_fast")]
    fast: usize,
    #[serde(default = "d_slow")]
    slow: usize,
    #[serde(default = "d_lookback")]
    lookback: usize,
    #[serde(default = "d_qty")]
    qty: f64,
    #[serde(default = "d_z")]
    z_entry: f64,
}
fn d_fast() -> usize { 10 }
fn d_slow() -> usize { 30 }
fn d_lookback() -> usize { 20 }
fn d_qty() -> f64 { 10.0 }
fn d_z() -> f64 { 1.0 }

impl Default for Params {
    fn default() -> Self {
        Self { fast: d_fast(), slow: d_slow(), lookback: d_lookback(), qty: d_qty(), z_entry: d_z() }
    }
}

#[derive(Deserialize)]
struct Request {
    strategy: String,
    #[serde(default)]
    params: Params,
    #[serde(default = "d_balance")]
    initial_balance: f64,
    #[serde(default = "d_path")]
    data_path: String,
}
fn d_balance() -> f64 { 10_000.0 }
fn d_path() -> String { "/tape.csv".to_string() }

// ── strategies, on the engine's own trait ─────────────────────────────────

fn intent(inst: &InstrumentId, side: Side, qty: Decimal, reduce_only: bool) -> OrderIntent {
    OrderIntent {
        instrument: inst.clone(),
        side,
        order_type: OrderType::Market,
        price: None,
        stop_price: None,
        qty,
        client_order_id: None,
        oco_group: None,
        source: OrderIntentSource::User,
        time_in_force: TimeInForce::Gtc,
        reduce_only,
        strategy_id: None,
        leg_group: None,
        net_limit: None,
    }
}

/// Shared long/flat plumbing: one close per bar, then a desired-state decision.
struct LongFlat {
    inst: InstrumentId,
    qty: Decimal,
    closes: Vec<f64>,
    last_ts: Option<time::OffsetDateTime>,
}

impl LongFlat {
    fn new(inst: InstrumentId, qty: f64) -> Self {
        Self { inst, qty: Decimal::from_f64(qty).unwrap_or(Decimal::ONE), closes: Vec::new(), last_ts: None }
    }

    /// Record this bar's close once (the runner may raise several events per bar).
    fn sample(&mut self, ctx: &StrategyContext<'_>, event: &Event) -> bool {
        if !matches!(event, Event::Market(_)) {
            return false;
        }
        if self.last_ts == Some(ctx.now) {
            return false;
        }
        let Some(px) = ctx.state.mid_or_last(&self.inst) else { return false };
        self.last_ts = Some(ctx.now);
        self.closes.push(px.to_f64().unwrap_or(0.0));
        true
    }

    fn act(&self, ctx: &StrategyContext<'_>, want_long: bool, out: &mut Vec<OrderIntent>) {
        let pos = ctx.state.position_qty(&self.inst);
        if want_long && pos <= Decimal::ZERO {
            out.push(intent(&self.inst, Side::Buy, self.qty, false));
        } else if !want_long && pos > Decimal::ZERO {
            out.push(intent(&self.inst, Side::Sell, pos, true));
        }
    }
}

fn mean(xs: &[f64]) -> f64 {
    xs.iter().sum::<f64>() / xs.len().max(1) as f64
}

/// Long when the fast SMA is above the slow SMA, flat otherwise.
struct SmaCross { core: LongFlat, fast: usize, slow: usize }
impl Strategy for SmaCross {
    fn on_event(&mut self, ctx: &StrategyContext<'_>, event: &Event, out: &mut Vec<OrderIntent>) {
        if !self.core.sample(ctx, event) { return; }
        let c = &self.core.closes;
        if c.len() < self.slow.max(self.fast) { return; }
        let fast = mean(&c[c.len() - self.fast..]);
        let slow = mean(&c[c.len() - self.slow..]);
        self.core.act(ctx, fast > slow, out);
    }
}

/// Long when the close is above the close `lookback` bars ago, flat otherwise.
struct Momentum { core: LongFlat, lookback: usize }
impl Strategy for Momentum {
    fn on_event(&mut self, ctx: &StrategyContext<'_>, event: &Event, out: &mut Vec<OrderIntent>) {
        if !self.core.sample(ctx, event) { return; }
        let c = &self.core.closes;
        if c.len() <= self.lookback { return; }
        let want = c[c.len() - 1] > c[c.len() - 1 - self.lookback];
        self.core.act(ctx, want, out);
    }
}

/// Long when the close is `z_entry` standard deviations below its SMA(lookback),
/// flat once it is back above the mean.
struct MeanRevert { core: LongFlat, lookback: usize, z_entry: f64, long: bool }
impl Strategy for MeanRevert {
    fn on_event(&mut self, ctx: &StrategyContext<'_>, event: &Event, out: &mut Vec<OrderIntent>) {
        if !self.core.sample(ctx, event) { return; }
        let c = &self.core.closes;
        if c.len() < self.lookback { return; }
        let w = &c[c.len() - self.lookback..];
        let m = mean(w);
        let sd = (w.iter().map(|x| (x - m) * (x - m)).sum::<f64>() / w.len() as f64).sqrt();
        let last = c[c.len() - 1];
        let z = if sd > 0.0 { (last - m) / sd } else { 0.0 };
        if !self.long && z < -self.z_entry { self.long = true; }
        if self.long && z >= 0.0 { self.long = false; }
        self.core.act(ctx, self.long, out);
    }
}

// ── running the engine ────────────────────────────────────────────────────

fn config(req: &Request) -> BacktestConfig {
    let mut balances = HashMap::new();
    balances.insert(
        Asset(smol_str::SmolStr::new("USD")),
        Decimal::from_f64(req.initial_balance).unwrap_or(Decimal::from(10_000)),
    );
    BacktestConfig {
        data_path: PathBuf::from(&req.data_path),
        data_format: DataFormat::Ohlcv,
        balances,
        record_equity_curve: true,
        ..BacktestConfig::default()
    }
}

fn run_request(json: &str) -> String {
    let req: Request = match serde_json::from_str(json) {
        Ok(r) => r,
        Err(e) => return format!(r#"{{"ok":false,"error":"bad request: {}"}}"#, e),
    };
    let cfg = config(&req);
    let inst = cfg.instrument.clone();
    let p = &req.params;
    let result = match req.strategy.as_str() {
        "buy_and_hold" => {
            let mut s = BuyAndHold::new(inst, Decimal::from_f64(p.qty).unwrap_or(Decimal::ONE));
            BacktestRunner::run_with_strategy(&cfg, &mut s)
        }
        "sma_cross" => {
            let mut s = SmaCross { core: LongFlat::new(inst, p.qty), fast: p.fast.max(1), slow: p.slow.max(2) };
            BacktestRunner::run_with_strategy(&cfg, &mut s)
        }
        "momentum" => {
            let mut s = Momentum { core: LongFlat::new(inst, p.qty), lookback: p.lookback.max(1) };
            BacktestRunner::run_with_strategy(&cfg, &mut s)
        }
        "mean_revert" => {
            let mut s = MeanRevert { core: LongFlat::new(inst, p.qty), lookback: p.lookback.max(2), z_entry: p.z_entry, long: false };
            BacktestRunner::run_with_strategy(&cfg, &mut s)
        }
        other => return format!(r#"{{"ok":false,"error":"unknown strategy: {}"}}"#, other),
    };
    match result {
        Ok(report) => match serde_json::to_string(&report) {
            Ok(r) => format!(r#"{{"ok":true,"report":{}}}"#, r),
            Err(e) => format!(r#"{{"ok":false,"error":"serialize: {}"}}"#, e),
        },
        Err(e) => format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e.to_string()).unwrap_or_default()),
    }
}

// ── C ABI over linear memory ──────────────────────────────────────────────

#[no_mangle]
pub extern "C" fn alloc(len: usize) -> *mut u8 {
    let mut v = Vec::<u8>::with_capacity(len);
    let p = v.as_mut_ptr();
    std::mem::forget(v);
    p
}

/// # Safety
/// `ptr`/`len` must come from `alloc` or a previous `run` result.
#[no_mangle]
pub unsafe extern "C" fn dealloc(ptr: *mut u8, len: usize) {
    if !ptr.is_null() {
        drop(Vec::from_raw_parts(ptr, 0, len));
    }
}

/// # Safety
/// `ptr`/`len` must describe a valid UTF-8 request written by the caller.
#[no_mangle]
pub unsafe extern "C" fn run(ptr: *const u8, len: usize) -> u64 {
    let input = std::slice::from_raw_parts(ptr, len);
    let json = String::from_utf8_lossy(input);
    let out = run_request(&json).into_bytes();
    let out_len = out.len();
    let out_ptr = out.as_ptr() as u64;
    std::mem::forget(out);
    (out_ptr << 32) | out_len as u64
}
