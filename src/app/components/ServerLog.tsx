"use client";

import { useEffect, useState } from "react";

const LOG_LINES = [
  { delay: 0,    text: "> initializing server..." },
  { delay: 600,  text: "> loading modules: [pg, express, ws]" },
  { delay: 1300, text: "> database connection established" },
  { delay: 1900, text: "> migrations up to date" },
  { delay: 2500, text: "> running on port 3000" },
  { delay: 3100, text: "> ready ✓" },
];

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
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
        <span className="ml-3 text-[0.6rem] text-muted/60">server.log</span>
      </div>
      <div className="p-4 space-y-1 min-h-[9rem]">
        {LOG_LINES.map((line, i) =>
          visible.includes(i) ? (
            <p key={i} className={`${line.text.includes("✓") ? "text-accent" : "text-muted"}`}>
              {line.text}
            </p>
          ) : null
        )}
        {visible.length === LOG_LINES.length && (
          <p className="text-muted/50 animate-pulse">_</p>
        )}
      </div>
    </div>
  );
}
