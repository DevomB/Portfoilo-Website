/* Counterexample, off the main thread: a request/response shell around the
   Ananke bundle. Every call is synchronous inside the engine; the worker
   keeps the page responsive while Minimize runs its hundreds of replays. */

import { loadAnanke, type AnankeApi, type Domain } from "./ananke";

export type RequestBody =
  | { type: "scenario"; seed: number; length: number }
  | { type: "run"; domain: Domain; commands: string[] }
  | { type: "minimize"; domain: Domain; commands: string[] }
  | { type: "branch"; domain: Domain; prefix: string[]; baseline: string[]; alternate: string[] };
export type Request = RequestBody & { id: number };
export type Response =
  | { id: number; ok: true; data: unknown; ms: number; version: string }
  | { id: number; ok: false; error: string };

let api: AnankeApi | null = null;
const post = (m: Response) => (self as unknown as Worker).postMessage(m);
const lines = (cmds: string[]) => cmds.join("\n");

self.onmessage = async (ev: MessageEvent<Request>) => {
  const m = ev.data;
  try {
    if (!api) api = await loadAnanke();
    const t0 = performance.now();
    let out: string;
    switch (m.type) {
      case "scenario": out = api.scenario(m.seed, m.length); break;
      case "run": out = api.run(m.domain, lines(m.commands)); break;
      case "minimize": out = api.minimize(m.domain, lines(m.commands)); break;
      case "branch": out = api.branch(m.domain, lines(m.prefix), lines(m.baseline), lines(m.alternate)); break;
    }
    post({ id: m.id, ok: true, data: JSON.parse(out), ms: Math.round(performance.now() - t0), version: api.version() });
  } catch (e) {
    post({ id: m.id, ok: false, error: (e as Error).message });
  }
};
