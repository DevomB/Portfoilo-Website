"use client";

import { useEffect, useState } from "react";
import { useLoaded } from "../contexts/LoadedContext";

// "{host}" is replaced at runtime with wherever the site is actually being
// served from — localhost:3000, devomb.com, a preview URL.
const LOG_LINES = [
  { delay: 0,    type: "info",   text: "> booting devomb.core" },
  { delay: 550,  type: "module", text: "> loading modules: ", tail: "[pg, redis, ws, wasm]" },
  { delay: 1200, type: "ok",     text: "> postgres pool ready · 20 conn" },
  { delay: 1800, type: "ok",     text: "> poker engine warm · 1.2M hands/s" },
  { delay: 2400, type: "info",   text: "> listening on {host}" },
  { delay: 3000, type: "ready",  text: "> ready ✓" },
];

const lineColor: Record<string, string> = {
  info:   "var(--color-muted)",
  module: "var(--color-secondary)",
  ok:     "var(--color-accent)",
  ready:  "var(--color-accent)",
};

export default function ServerLog() {
  const [visible, setVisible] = useState<number[]>([]);
  const [host, setHost] = useState("localhost");
  // The page is mounted beneath the splash from the first render; the log
  // waits for the reveal so its lines are not all spent before anyone sees it.
  const loaded = useLoaded();

  useEffect(() => {
    if (!loaded) return;
    const timers = LOG_LINES.map((line, i) =>
      setTimeout(() => {
        // read the real host as the first line lands — well before the
        // "listening on" line needs it
        if (i === 0) setHost(window.location.host || "localhost");
        setVisible((v) => [...v, i]);
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [loaded]);

  return (
    <div
      className="w-full rounded-xl border border-accent/25 bg-surface font-mono text-fluid-xs leading-relaxed overflow-hidden"
      aria-hidden
    >
      {/* window chrome: file name reads from the left edge, lights on the right */}
      <div className="flex items-center border-b border-accent/20 bg-surface px-4 py-2.5">
        <span className="text-[0.6rem] text-muted/60">server.log</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
        </span>
      </div>
      <div className="p-4 space-y-1 min-h-[9rem]">
        {LOG_LINES.map((line, i) =>
          visible.includes(i) ? (
            <p key={i} style={{ color: lineColor[line.type] ?? "var(--color-muted)" }}>
              {line.type === "module"
                ? <>
                    <span style={{ color: "var(--color-muted)" }}>{line.text}</span>
                    <span style={{ color: "var(--color-secondary)", fontWeight: 600 }}>{line.tail}</span>
                  </>
                : line.text.replace("{host}", host)}
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
