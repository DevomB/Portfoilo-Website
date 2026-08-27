"use client";

import { useEffect, useState } from "react";

const LOG_LINES = [
  { delay: 0,    text: "> initializing server...",             type: "info" },
  { delay: 600,  text: "> loading modules: [pg, express, ws]", type: "module" },
  { delay: 1300, text: "> database connection established",     type: "ok" },
  { delay: 1900, text: "> migrations up to date",              type: "ok" },
  { delay: 2500, text: "> running on port 3000",               type: "info" },
  { delay: 3100, text: "> ready ✓",                            type: "ready" },
];

const lineColor: Record<string, string> = {
  info:   "var(--color-muted)",
  module: "var(--color-secondary)",
  ok:     "var(--color-accent)",
  ready:  "var(--color-accent)",
};

export default function ServerLog() {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const timers = LOG_LINES.map((line, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="w-full rounded-xl border border-accent/25 bg-surface font-mono text-fluid-xs leading-relaxed overflow-hidden"
      aria-hidden
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-accent/20 bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
        <span className="ml-3 text-[0.6rem] text-muted/60">server.log</span>
      </div>
      <div className="p-4 space-y-1 min-h-[9rem]">
        {LOG_LINES.map((line, i) =>
          visible.includes(i) ? (
            <p key={i} style={{ color: lineColor[line.type] ?? "var(--color-muted)" }}>
              {line.type === "module"
                ? <>
                    <span style={{ color: "var(--color-muted)" }}>{"> loading modules: "}</span>
                    <span style={{ color: "var(--color-secondary)", fontWeight: 600 }}>{"[pg, express, ws]"}</span>
                  </>
                : line.text}
            </p>
          ) : null
        )}
        {visible.length === LOG_LINES.length && (
          <p className="animate-pulse" style={{ color: "var(--color-accent)", opacity: 0.5 }}>_</p>
        )}
      </div>
    </div>
  );
}
