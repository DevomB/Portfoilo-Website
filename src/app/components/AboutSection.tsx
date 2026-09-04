"use client";

import { m } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
});

const stack = [
  { slug: "postgresql",  label: "PostgreSQL" },
  { slug: "nodedotjs",   label: "Node.js" },
  { slug: "typescript",  label: "TypeScript" },
  { slug: "cplusplus",   label: "C++20" },
  { slug: "nextdotjs",   label: "Next.js" },
  { slug: "flutter",     label: "Flutter" },
  { slug: "redis",       label: "Redis" },
];

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 section-y">
      <m.p {...fade(0)} className="font-mono text-fluid-xs text-secondary tracking-wide mb-10">
        {"// about"}
      </m.p>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <m.div {...fade(0.05)}>
          <div className="space-y-4 text-fluid-base leading-relaxed text-muted">
            <p>
              Based in Eastvale, California. I design and build backends for
              production systems — PostgreSQL schemas, API layers, and parallel
              C++ simulation engines.
            </p>
            <p>
              Lately: an event-driven backtesting engine in Rust, a deterministic
              event runtime in OCaml, a Go engine that plays, and poker math shipped
              as an npm package with a C++ core. Everything demoed on this site runs
              the real thing — nothing is ported to make it fit.
            </p>
          </div>
        </m.div>

        <m.div {...fade(0.1)}>
          <p className="mb-4 font-mono text-fluid-xs text-muted/50 uppercase tracking-widest">Stack</p>
          <div className="flex flex-wrap gap-x-5 gap-y-4">
            {stack.map((s) => (
              <div key={s.slug} className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.simpleicons.org/${s.slug}/1c1916`}
                  alt={s.label}
                  width={22}
                  height={22}
                  style={{ opacity: 0.7 }}
                />
                <span className="font-mono text-[0.58rem] text-muted/60">{s.label}</span>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
