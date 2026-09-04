"use client";

import Link from "next/link";
import { m } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
});

const schools = [
  {
    name: "UC San Diego Extended Studies",
    detail: "Multivariable Calculus & Ordinary Differential Equations",
    meta: "Jun – Dec 2025 · A / A",
    href: "https://extendedstudies.ucsd.edu/",
  },
  {
    name: "Norco College",
    detail: "CIS-5 · CIS-17A · CIS-17B · CIS-17C — C++ and data structures",
    meta: "Certificate pathway · all A",
    href: null,
  },
];

const certs = [
  {
    name: "HackerRank SQL Intermediate",
    href: "https://www.hackerrank.com/certificates/c0c28b8206b3",
    meta: "May 2024",
  },
  {
    name: "HackerRank SQL Basic",
    href: "https://www.hackerrank.com/certificates/900b33f389dd",
    meta: "May 2024",
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-28 section-y">
      <m.p {...fade(0)} className="font-mono text-fluid-xs text-secondary tracking-wide mb-10">
        {"// education"}
      </m.p>

      <div className="mb-10">
        {schools.map((s, i) => (
          <m.div key={s.name} {...fade(i * 0.06)}>
            {i > 0 && <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />}
            <div className="flex gap-5 py-7">
              <span
                className="shrink-0 font-mono tabular-nums select-none pt-px"
                style={{ fontSize: "0.65rem", color: "var(--color-muted)", opacity: 0.5, minWidth: "2ch" }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="font-semibold text-fluid-sm text-ink">{s.name}</p>
                  <span className="font-mono text-fluid-xs text-muted/60 shrink-0">{s.meta}</span>
                </div>
                <p className="mt-1 text-fluid-sm text-muted">{s.detail}</p>
                {s.href && (
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-mono text-fluid-xs text-accent hover:text-accent-dim transition-colors"
                  >
                    ucsd.edu ↗
                  </Link>
                )}
              </div>
            </div>
          </m.div>
        ))}
        <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />
      </div>

      <m.div {...fade(0.15)}>
        <p className="font-mono text-fluid-xs mb-5" style={{ color: "var(--color-muted)", opacity: 0.5 }}>
          SELECT name, issued_at FROM credentials ORDER BY issued_at DESC;
        </p>
        <div>
          {certs.map((c, i) => (
            <div key={c.href}>
              {i > 0 && <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />}
              <Link
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-6 py-4 transition-opacity hover:opacity-70"
              >
                <span className="text-fluid-sm text-ink">{c.name}</span>
                <span className="font-mono text-fluid-xs text-muted/60 shrink-0">{c.meta}</span>
              </Link>
            </div>
          ))}
          <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />
        </div>
      </m.div>
    </section>
  );
}
