"use client";

import { motion } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
});

const stack = [
  "PostgreSQL", "Node.js", "TypeScript", "C++20",
  "Next.js", "Flutter", "REST APIs", "Redis",
];

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 section-y">
      <motion.p {...fade(0)} className="font-mono text-fluid-xs text-accent tracking-wide mb-10">
        // about
      </motion.p>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fade(0.05)}>
          <div className="space-y-4 text-fluid-base leading-relaxed text-muted">
            <p>
              Based in Eastvale, California. I design and build backends for
              production systems — PostgreSQL schemas, API layers, and parallel
              C++ simulation engines.
            </p>
            <p>
              Currently leading engineering at Roosevelt Connect and Virtual Medical
              Missions: thousands of students, and patient records during live
              telemedicine sessions in rural Kenya.
            </p>
          </div>
        </motion.div>

        <motion.div {...fade(0.1)}>
          <p className="mb-3 font-mono text-fluid-xs text-muted/50 uppercase tracking-widest">Stack</p>
          <p className="font-mono text-fluid-xs text-muted leading-loose">
            {stack.join(" · ")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
