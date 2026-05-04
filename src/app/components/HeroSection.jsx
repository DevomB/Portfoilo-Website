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
          <p className="mb-3 text-fluid-xs font-medium uppercase tracking-[0.18em] text-muted">
            Eastvale, California
          </p>
          <h1 className="font-heading text-fluid-hero font-semibold leading-[1.1] tracking-tight text-white">
            Hi, I&apos;m{" "}
            <span className="text-accent-blue">Devom</span>
            <br />
            <span className="text-muted">Full-stack developer</span>
          </h1>
          <p className="prose-readable mx-auto mt-6 text-fluid-lg leading-relaxed text-muted sm:mx-0">
            I work on Roosevelt Connect (Flutter and APIs), Virtual Medical
            Missions (telemedicine), and WebWork Innovations (Next.js sites with
            PostgreSQL). C++ coursework and Poker-Bot on the side.
          </p>
          <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:mx-0 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-start">
            <Link
              href="#demo"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg bg-accent-blue px-5 text-fluid-sm font-semibold text-bg shadow-card transition hover:bg-accent-blue-dim sm:min-h-0 sm:w-auto"
            >
              Open PokerLab
            </Link>
            <Link
              href="https://github.com/DevomB"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg border border-border bg-surface px-5 text-fluid-sm font-semibold text-white transition hover:border-border hover:bg-surface-elevated sm:min-h-0 sm:w-auto"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/devomb/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg border border-border bg-surface px-5 text-fluid-sm font-semibold text-white transition hover:border-border hover:bg-surface-elevated sm:min-h-0 sm:w-auto"
            >
              LinkedIn
            </Link>
            <Link
              href="#contact"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg border border-accent-blue/30 bg-accent-blue/5 px-5 text-fluid-sm font-semibold text-accent-blue transition hover:bg-accent-blue/10 sm:min-h-0 sm:w-auto"
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
          <div
            className="relative flex aspect-square w-[min(100%,clamp(10rem,28vw,16rem))] max-w-[16rem] items-center justify-center rounded-2xl border border-border bg-surface-elevated shadow-card"
            aria-hidden
          >
            <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-accent-blue/10 to-accent-purple/8" />
            <span className="relative font-heading text-fluid-4xl font-bold tracking-tight text-white">
              DB
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
