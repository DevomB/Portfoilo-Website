import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Landscape from "@/app/components/Landscape";

export const metadata: Metadata = {
  title: "The Landscape",
  description:
    "All 169 starting hands as a terrain — height is equity, computed live by the poker-calculations engine. Deal a flop and watch it deform.",
};

export default function LandscapePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <Link
            href="/projects/poker-bot"
            className="inline-flex items-center gap-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink mb-8"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            back to project
          </Link>

          <div className="mb-8">
            <p className="font-mono text-fluid-xs text-secondary tracking-wide mb-2">{"// landscape"}</p>
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">The Landscape</h1>
            <p className="mt-2 text-fluid-base text-muted max-w-xl">
              Every one of the 169 starting hands as terrain. Height is equity, computed live by
              the C++ engine behind{" "}
              <a
                href="https://www.npmjs.com/package/poker-calculations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                poker-calculations
              </a>
              . Deal a flop and watch the mountains move. Paint your range to see its shape on
              the board.
            </p>
          </div>

          <Landscape />
        </div>
      </main>
    </>
  );
}
