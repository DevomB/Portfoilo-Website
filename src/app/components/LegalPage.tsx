import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

/** Shared shell for the plain-language legal pages (/privacy, /terms). */
export default function LegalPage({
  title,
  lede,
  updated,
  children,
}: {
  title: string;
  lede: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink mb-8"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            back home
          </Link>

          <header className="mb-10 max-w-2xl">
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">{title}</h1>
            <p className="mt-3 text-fluid-lg text-muted">{lede}</p>
            <p className="mt-4 font-mono text-fluid-xs text-muted opacity-60">
              last updated {updated}
            </p>
          </header>

          <div className="max-w-2xl pb-4">{children}</div>
        </div>
        <Footer />
      </main>
    </>
  );
}

/** One numbered section of a legal page. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="font-title text-fluid-xl font-semibold tracking-tight text-ink">{heading}</h2>
      <div className="mt-3 space-y-3 text-fluid-base leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

/** The short "here's the whole thing in one box" summary at the top. */
export function LegalSummary({ children }: { children: ReactNode }) {
  return (
    <div className="card-soft mb-4 px-5 py-4">
      <p className="font-mono text-fluid-xs text-accent-dim mb-2">the short version</p>
      <div className="space-y-2 text-fluid-base leading-relaxed text-ink">{children}</div>
    </div>
  );
}

/** Inline external link, styled like the rest of the site's body links. */
export function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-accent-dim underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
    >
      {children}
    </Link>
  );
}
