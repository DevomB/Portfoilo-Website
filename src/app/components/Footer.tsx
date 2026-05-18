"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [ts, setTs] = useState<string | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    setTs(new Date().toISOString());
  }, []);

  return (
    <footer className="relative overflow-hidden border-t bg-bg" style={{ borderColor: "rgba(39,103,135,0.22)" }}>
      {/* minimal top bar */}
      <div className="mx-auto flex w-[min(100%-2*var(--shell-inline),76rem)] items-center justify-between px-[var(--shell-inline)] py-8">
        <div className="flex items-center gap-2">
          <span
            className="relative flex h-2 w-2"
            aria-hidden
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[0.65rem] text-muted">server online</span>
          {ts && (
            <>
              <span className="font-mono text-[0.65rem] text-muted/40">·</span>
              <span className="font-mono text-[0.65rem] text-muted/40 select-none">{ts}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-5">
          {[
            { label: "GitHub", href: "https://github.com/DevomB" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/devomb/" },
            { label: "npm", href: "https://www.npmjs.com/package/poker-calculations" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-fluid-xs text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <span className="font-mono text-[0.65rem] text-muted/40">© {year}</span>
        </div>
      </div>

      {/* giant name — partially cut off at bottom */}
      <div
        className="select-none overflow-hidden"
        style={{
          /* show first line fully + ~35% of second line */
          maxHeight: "1.38em",
          fontSize: "clamp(3.8rem, 13.5vw, 17rem)",
        }}
        aria-hidden
      >
        <p
          className="font-black leading-none tracking-tighter"
          style={{
            fontSize: "inherit",
            color: "#c2d9e8",
            paddingLeft: "var(--shell-inline)",
          }}
        >
          DEVOM<br />BRAHMBATT
        </p>
      </div>

      {/* tiny bottom strip so page doesn't end abruptly */}
      <div className="h-3 bg-bg" />
    </footer>
  );
}
