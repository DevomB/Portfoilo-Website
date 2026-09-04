"use client";

import { m } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
});

const roles = [
  {
    org: "Drip",
    title: "Founding Engineer Intern",
    span: "Jan 2026 – Apr 2026",
    location: "San Francisco · Hybrid",
    bullets: ["Feature work on an early-stage product."],
  },
  {
    org: "Roosevelt Connect · Eleanor Roosevelt HS",
    title: "Full-Stack Developer",
    span: "Jul 2024 – Present",
    location: "Eastvale · Hybrid",
    bullets: [
      "Platform serving thousands of students: resources, messaging, and academic tools.",
      "Flutter client backed by REST APIs and a PostgreSQL data layer.",
    ],
  },
  {
    org: "Virtual Medical Missions",
    title: "President · Head of Computer Science",
    span: "Apr 2024 – Present",
    location: "Eastvale · Hybrid",
    bullets: [
      "501(c)(3) telemedicine: 400+ patients served during recent rural Kenya mission.",
      "PostgreSQL under live session load; optimistic concurrency for concurrent record writes.",
      "Next.js front end built for volunteer non-engineers to use under pressure.",
    ],
  },
  {
    org: "WebWork Innovations",
    title: "Founder · Lead Developer",
    span: "Jun 2024 – Jan 2026",
    location: "Eastvale · Hybrid",
    bullets: ["10+ client sites delivered: Next.js, PostgreSQL, Node, TypeScript, Vercel."],
  },
  {
    org: "Ascend Labs",
    title: "CEO · Founder · Developer",
    span: "Sep 2024 – Nov 2025",
    location: "Remote",
    bullets: ["Small-scope experiments and prototypes in the JS ecosystem."],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-28 section-y">
      <m.p {...fade(0)} className="font-mono text-fluid-xs text-secondary tracking-wide mb-10">
        {"// experience"}
      </m.p>

      <div>
        {roles.map((job, i) => (
          <m.article key={job.org + job.title} {...fade(i * 0.06)}>
            {i > 0 && <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />}
            <div className="flex gap-5 py-7">
              <span
                className="shrink-0 font-mono tabular-nums select-none pt-px"
                style={{ fontSize: "0.65rem", color: "var(--color-accent)", opacity: 0.55, minWidth: "2ch" }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <p className="font-semibold text-fluid-sm text-ink">{job.title}</p>
                    <p className="text-fluid-sm font-medium" style={{ color: "var(--color-secondary)" }}>{job.org}</p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="font-mono text-fluid-xs text-muted">{job.span}</p>
                    <p className="font-mono text-fluid-xs" style={{ color: "var(--color-muted)", opacity: 0.5 }}>{job.location}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 items-baseline text-fluid-sm leading-relaxed text-muted">
                      <span className="shrink-0 h-[4px] w-[4px] rounded-full mt-[0.45em]" style={{ background: "var(--color-accent)" }} aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </m.article>
        ))}
        <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />
      </div>
    </section>
  );
}
