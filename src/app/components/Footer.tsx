import Link from "next/link";

const links = [
  { label: "GitHub", href: "https://github.com/DevomB", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/devomb/", external: true },
  { label: "NPM", href: "https://www.npmjs.com/~devomb", external: true },
  { label: "Crates", href: "https://crates.io/users/DevomB", external: true },
  { label: "Privacy", href: "/privacy", external: false },
  { label: "Terms", href: "/terms", external: false },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t bg-bg" style={{ borderColor: "rgb(var(--brand-purple-rgb) / 0.22)" }}>
      {/* centered link row, copyright on its own line beneath */}
      <div className="mx-auto w-[min(100%-2*var(--shell-inline),76rem)] px-[var(--shell-inline)] pt-8 pb-1">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-mono text-fluid-xs text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p className="mt-5 text-center font-mono text-fluid-xs text-muted opacity-60">
          © {year} Devom Brahmbhatt
        </p>
      </div>

      <div className="select-none overflow-hidden" style={{ marginTop: "-5px" }} aria-hidden>
        <p
          className="text-center font-black leading-none tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(2.8rem, 16.8vw, 20.8rem)",
            color: "var(--color-accent-dim)",
            paddingInline: "var(--shell-inline)",
          }}
        >
          DEVOM
        </p>
      </div>

      {/* tiny bottom strip so page doesn't end abruptly */}
      <div className="h-3 bg-bg" />
    </footer>
  );
}
