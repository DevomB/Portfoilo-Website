"use client";

import { Fragment } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { fade } from "./fade";
import { sideQuests, alsoBuilt } from "@/data/sideQuests";

export default function SideQuestsSection() {
  return (
    <section id="side-quests" className="scroll-mt-28 section-y">
      <m.p {...fade(0)} className="font-mono text-fluid-xs text-secondary tracking-wide mb-10">
        {"// side quests"}
      </m.p>

      {/* capped width and muted link so this reads as an aside, not a showcase */}
      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        {sideQuests.map((q, i) => (
          <m.div key={q.name} {...fade(0.1 + i * 0.08)}>
            <a
              href={q.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-soft group block overflow-hidden transition-opacity hover:opacity-70"
            >
              <div className="relative aspect-video border-b border-border bg-code-bg">
                <Image
                  src={q.image}
                  alt={q.name + " — screenshot"}
                  fill
                  sizes="(min-width: 1024px) 36rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-fluid-sm text-ink">{q.name}</p>
                  <p className="mt-0.5 text-fluid-xs leading-relaxed text-muted">{q.blurb}</p>
                </div>
                <span className="shrink-0 font-mono text-fluid-xs text-muted transition-colors group-hover:text-accent">site ↗</span>
              </div>
            </a>
          </m.div>
        ))}
      </div>

      <m.p {...fade(0.3)} className="mt-6 font-mono text-fluid-xs text-muted">
        <span className="opacity-60">also built —</span>{" "}
        {alsoBuilt.map((a, i) => (
          <Fragment key={a.name}>
            {i > 0 && <span className="opacity-40"> · </span>}
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {a.name}
            </a>
          </Fragment>
        ))}
      </m.p>
    </section>
  );
}
