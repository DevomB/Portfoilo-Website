"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative scroll-mt-28 section-y">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="place-self-start text-center sm:text-left lg:col-span-8"
        >
          <p className="mb-3 text-fluid-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Eastvale, California · Full-stack
          </p>
          <h1 className="font-heading text-fluid-hero font-semibold leading-[1.05] tracking-tight text-ink">
            Product-minded engineering for
            <span className="text-accent-blue"> ambitious teams</span>.
          </h1>
          <p className="prose-readable mx-auto mt-6 text-fluid-lg leading-relaxed text-muted sm:mx-0">
            I build platforms for Roosevelt Connect, Virtual Medical Missions,
            and WebWork Innovations. My focus: resilient APIs, expressive UIs,
            and applied simulation for decision-heavy products.
          </p>
          <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:mx-0 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-start">
            <Link
              href="#demo"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-accent-blue px-6 text-fluid-sm font-semibold text-white shadow-card transition hover:bg-accent-blue-dim sm:min-h-0 sm:w-auto"
            >
              Explore PokerLab
            </Link>
            <Link
              href="https://www.linkedin.com/in/devomb/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-border bg-surface-elevated px-6 text-fluid-sm font-semibold text-ink transition hover:bg-white sm:min-h-0 sm:w-auto"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com/DevomB"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-border bg-surface-elevated px-6 text-fluid-sm font-semibold text-ink transition hover:bg-white sm:min-h-0 sm:w-auto"
            >
              GitHub
            </Link>
            <Link
              href="#contact"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-accent-blue/40 bg-accent-blue/10 px-6 text-fluid-sm font-semibold text-accent-blue transition hover:bg-accent-blue/15 sm:min-h-0 sm:w-auto"
            >
              Contact
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex justify-center lg:col-span-4 lg:justify-end"
        >
          <div className="w-full max-w-sm space-y-4">
            <div className="card-soft relative flex aspect-[4/5] w-full items-end overflow-hidden p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(210,106,58,0.18),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(42,111,107,0.2),transparent_50%)]" />
              <div className="relative">
                <p className="text-fluid-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Devom Brahmbhatt
                </p>
                <p className="mt-2 font-heading text-fluid-3xl font-semibold text-ink">
                  Building for resilience.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="card-soft p-4">
                <p className="text-fluid-xs uppercase tracking-[0.2em] text-muted">
                  Focus
                </p>
                <p className="mt-2 text-fluid-sm font-semibold text-ink">
                  APIs · Data · Product UI
                </p>
              </div>
              <div className="card-soft p-4">
                <p className="text-fluid-xs uppercase tracking-[0.2em] text-muted">
                  Stack
                </p>
                <p className="mt-2 text-fluid-sm font-semibold text-ink">
                  Next.js · Flutter · PostgreSQL
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
