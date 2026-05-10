import Link from "next/link";

const POKER_CALC_NPM = "https://www.npmjs.com/package/poker-calculations";

export default function Footer() {
  const year = new Date().getFullYear();
  const footerLink =
    "inline-flex min-h-11 touch-manipulation items-center text-fluid-sm text-muted transition hover:text-accent-blue sm:min-h-10";

  return (
    <footer className="relative z-10 border-t border-border bg-bg/95 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10 backdrop-blur">
      <div className="mx-auto flex w-[min(100%-2*var(--shell-inline),76rem)] flex-col gap-6 px-[var(--shell-inline)] pb-12 pt-0 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-fluid-lg font-semibold text-ink">
            Devom Brahmbhatt
          </p>
          <p className="mt-1 text-fluid-sm text-muted">
            Eastvale, CA · © {year}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            className={footerLink}
            href="https://github.com/DevomB"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link
            className={`${footerLink} hover:text-accent-purple`}
            href="https://www.linkedin.com/in/devomb/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
          <Link className={footerLink} href="#demo">
            PokerLab
          </Link>
          <Link
            className={`${footerLink} hover:text-accent-purple`}
            href={POKER_CALC_NPM}
            target="_blank"
            rel="noopener noreferrer"
            title="Monte Carlo engine for PokerLab"
          >
            poker-calculations
          </Link>
        </div>
      </div>
    </footer>
  );
}
