import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-border bg-bg/90 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-lg font-semibold text-white">Devom Brahmbhatt</p>
          <p className="text-sm text-muted">Eastvale · Hybrid · © {year}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            className="text-muted transition hover:text-accent-blue"
            href="https://github.com/DevomB"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link
            className="text-muted transition hover:text-accent-purple"
            href="https://www.linkedin.com/in/devomb/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
          <Link className="text-muted transition hover:text-accent-blue" href="#demo">
            PokerLab
          </Link>
        </div>
      </div>
    </footer>
  );
}
