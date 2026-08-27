import Link from "next/link";
import type { Metadata } from "next";

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
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
            <span className="ml-3 font-mono text-[0.6rem] text-muted/60">bash — 80×24</span>
          </div>
          {/* terminal body */}
          <div className="bg-white px-5 py-6 font-mono text-fluid-sm space-y-2">
            <p className="text-muted">
              <span className="text-secondary">devom@brahmbatt</span>
              <span className="text-muted">:</span>
              <span className="text-ink">~</span>
              <span className="text-muted">$ </span>
              GET {"{path}"}
            </p>
            <p className="text-danger">
              Error: 404 — route not found
            </p>
            <p className="text-muted">
              No handler registered for this path.
            </p>
            <p className="text-muted mt-2">
              Did you mean:{" "}
              <Link href="/" className="text-accent hover:text-accent-dim transition-colors">
                /
              </Link>
              {" "}?
            </p>
            <p className="text-muted/50 mt-4 text-fluid-xs">
              exit code 404 · process terminated
            </p>
            <p className="animate-pulse text-muted">_</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-fluid-sm font-semibold text-white transition-all hover:bg-accent-dim shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Go home
          </Link>
          <Link
            href="/#projects"
            className="text-fluid-sm text-muted hover:text-ink transition-colors"
          >
            View projects
          </Link>
        </div>
      </div>
    </main>
  );
}
