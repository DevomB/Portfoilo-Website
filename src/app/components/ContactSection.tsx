"use client";

import Link from "next/link";
import { m } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
});

const githubHref = "https://github.com/DevomB";
const linkedinHref = "https://www.linkedin.com/in/devomb/";

export default function ContactSection() {
  const email =
    typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL === "string"
      ? process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()
      : "";

  const links = [
    { label: "GitHub", sub: "@DevomB", href: githubHref, external: true },
    { label: "LinkedIn", sub: "devomb", href: linkedinHref, external: true },
    ...(email ? [{ label: "Email", sub: email, href: `mailto:${encodeURIComponent(email)}`, external: false }] : []),
  ];

  return (
    <section id="contact" className="scroll-mt-28 section-y">
      <m.p {...fade(0)} className="font-mono text-fluid-xs text-secondary tracking-wide mb-10">
        // contact
      </m.p>

      <div>
        {links.map((l, i) => (
          <m.div key={l.label} {...fade(i * 0.06)}>
            {i > 0 && <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />}
            <Link
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-baseline justify-between gap-6 py-7 transition-opacity hover:opacity-70"
            >
              <span className="font-semibold text-fluid-base" style={{ color: "var(--color-secondary)" }}>{l.label}</span>
              <span className="font-mono text-fluid-xs text-muted/60 shrink-0">{l.sub}</span>
            </Link>
          </m.div>
        ))}
        <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />
      </div>
    </section>
  );
}
