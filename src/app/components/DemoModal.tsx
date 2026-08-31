"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import PokerLab from "./PokerLab";

interface Props {
  demoSlug: string;
}

export default function DemoModal({ demoSlug }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-fluid-sm font-medium text-ink transition-all hover:border-accent/40 hover:bg-accent-bg hover:text-accent-dim"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Live demo
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <m.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgb(var(--brand-black-rgb) / 0.75)", backdropFilter: "blur(3px)" }}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            {/* Panel — positioning wrapper keeps centering; m.div handles animation */}
            <div
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: "calc(100% - 2rem)", maxWidth: "56rem" }}
            >
            <m.div
              key="panel"
              role="dialog"
              aria-modal
              aria-label={`${demoSlug} live demo`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
              className="flex flex-col rounded-xl border overflow-hidden"
              style={{
                maxHeight: "90vh",
                borderColor: "var(--color-border)",
                background: "var(--color-bg)",
              }}
            >
              {/* Sticky header */}
              <div
                className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div>
                  <p className="font-mono text-fluid-xs text-secondary tracking-wide">// {demoSlug}</p>
                  <p className="font-semibold text-fluid-base text-ink mt-0.5">
                    PokerLab · NL Hold&apos;em Equity
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-md border text-muted transition-colors hover:text-ink hover:border-accent/40"
                  style={{ borderColor: "var(--color-border)" }}
                  aria-label="Close demo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto p-6">
                <PokerLab />
                <p className="mt-8 font-mono text-fluid-xs text-muted" style={{ opacity: 0.45 }}>
                  Runs via the{" "}
                  <a
                    href="https://www.npmjs.com/package/poker-calculations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-ink transition-colors"
                  >
                    poker-calculations
                  </a>{" "}
                  C++ engine · Monte Carlo vs one random villain · no burn cards in demo
                </p>
              </div>
            </m.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
