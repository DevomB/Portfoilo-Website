/* Loader for the Adversarial Tape engine: Athena's Pallas compiled to WASI.
   The engine reads its tape from a file, so it gets one — an in-memory WASI
   filesystem with a single `/tape.csv` that we overwrite before every run.
   Nothing about the engine changes; it opens a path and parses CSV exactly as
   the CLI does. */

import { WASI, File, OpenFile, ConsoleStdout, PreopenDirectory } from "@bjorn3/browser_wasi_shim";

export type ArenaStrategy = "sma_cross" | "momentum" | "mean_revert" | "buy_and_hold";

export type ArenaParams = { fast?: number; slow?: number; lookback?: number; qty?: number; z_entry?: number };

export type ArenaReport = {
  pnl: string;
  pnl_pct: string;
  max_drawdown: number;
  sharpe: number;
  sortino: number;
  fill_count: number;
  closed_trades: number;
  win_rate: number;
  equity_curve: { ts: string; equity_quote: string }[];
  wall_time_ms: number;
  total_fees: string;
};

type Exports = {
  memory: WebAssembly.Memory;
  alloc: (len: number) => number;
  dealloc: (ptr: number, len: number) => void;
  run: (ptr: number, len: number) => bigint;
  _initialize?: () => void;
};

export class PallasArena {
  private constructor(
    private readonly ex: Exports,
    private readonly tape: File,
    public readonly stderr: string[],
  ) {}

  static async load(url = "/wasm/pallas-arena.wasm"): Promise<PallasArena> {
    const bytes = await (await fetch(url)).arrayBuffer();
    const tape = new File(new Uint8Array());
    const stderr: string[] = [];
    const fds = [
      new OpenFile(new File(new Uint8Array())), // stdin
      ConsoleStdout.lineBuffered(() => {}), // stdout (the engine is quiet)
      ConsoleStdout.lineBuffered((line) => { stderr.push(line); if (stderr.length > 50) stderr.shift(); }),
      new PreopenDirectory("/", new Map([["tape.csv", tape]])),
    ];
    const wasi = new WASI([], [], fds);
    const { instance } = await WebAssembly.instantiate(bytes, { wasi_snapshot_preview1: wasi.wasiImport });
    const ex = instance.exports as unknown as Exports;
    // a WASI "reactor": run its initialisers once, then call exports at will
    if (typeof ex._initialize === "function") wasi.initialize(instance as never);
    return new PallasArena(ex, tape, stderr);
  }

  /** Run one backtest on `csv` with the engine. Throws on an engine error. */
  run(csv: string, strategy: ArenaStrategy, params: ArenaParams = {}, initialBalance = 10_000): ArenaReport {
    this.tape.data = new TextEncoder().encode(csv);
    const req = new TextEncoder().encode(JSON.stringify({ strategy, params, initial_balance: initialBalance, data_path: "/tape.csv" }));
    const inPtr = this.ex.alloc(req.length);
    new Uint8Array(this.ex.memory.buffer, inPtr, req.length).set(req);
    const packed = this.ex.run(inPtr, req.length);
    this.ex.dealloc(inPtr, req.length);
    // BigInt() calls rather than literals: the TS target predates ES2020 syntax
    const outPtr = Number(packed >> BigInt(32));
    const outLen = Number(packed & BigInt(0xffffffff));
    // memory may have grown during the run — always re-read the buffer
    const text = new TextDecoder().decode(new Uint8Array(this.ex.memory.buffer, outPtr, outLen));
    this.ex.dealloc(outPtr, outLen);
    const res = JSON.parse(text) as { ok: true; report: ArenaReport } | { ok: false; error: string };
    if (!res.ok) throw new Error(res.error);
    return res.report;
  }
}
