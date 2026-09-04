import Link from "next/link";
import type { Metadata } from "next";
import NotFoundTerminal from "./components/NotFoundTerminal";

export const metadata: Metadata = {
  title: "404 — Not Found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-lg">
        {/* terminal window */}
        <div className="rounded-xl border border-border overflow-hidden shadow-card">
          {/* chrome */}
          <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok" />
            <span className="ml-3 font-mono text-[0.6rem] text-muted">bash — 80×24</span>
          </div>
          {/* terminal body — reads the missed path in the browser */}
          <NotFoundTerminal />
        </div>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-display text-fluid-sm font-semibold text-white transition-all hover:bg-accent-dim shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
