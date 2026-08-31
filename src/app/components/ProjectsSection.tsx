"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { projects } from "@/data/projects";

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
});

export default function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-28 section-y">
      <m.p {...fade(0)} className="font-mono text-fluid-xs text-secondary tracking-wide mb-10">
        // projects
      </m.p>

      <div>
        {projects.map((p, i) => (
          <m.div key={p.slug} {...fade(i * 0.06)}>
            {i > 0 && <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />}
            <Link
              href={`/projects/${p.slug}`}
              className="group flex gap-5 py-7 transition-opacity hover:opacity-70"
            >
              <span
                className="shrink-0 font-mono tabular-nums select-none pt-px"
                style={{ fontSize: "0.65rem", color: "var(--color-accent)", opacity: 0.55, minWidth: "2ch" }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="font-semibold text-fluid-sm text-ink">{p.name}</p>
                  {(p.demoSlug || p.liveUrl) && (
                    <span className="font-mono text-fluid-xs text-accent shrink-0">
                      {p.demoSlug ? "live demo ↗" : "site ↗"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-fluid-sm leading-relaxed text-muted">{p.tagline}</p>
                <p className="mt-2.5 font-mono text-fluid-xs text-muted/60">
                  {p.techStack.slice(0, 4).join(" · ")}{p.techStack.length > 4 ? ` · +${p.techStack.length - 4}` : ""}
                </p>
              </div>
            </Link>
          </m.div>
        ))}
        <div className="w-full h-px" style={{ background: "var(--color-border)" }} aria-hidden />
      </div>
    </section>
  );
}
