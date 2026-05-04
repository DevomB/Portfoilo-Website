"use client";

import Link from "next/link";
import React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative scroll-mt-28 py-12 lg:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="place-self-start text-center sm:text-left lg:col-span-8"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent-blue">
            Eastvale · Hybrid builder
          </p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Devom
            </span>
            <br />
            <span className="text-muted">
              <TypeAnimation
                sequence={[
                  "Full-stack developer",
                  1400,
                  "Founding engineer",
                  1400,
                  "Flutter + Next.js shipper",
                  1400,
                  "Systems-minded competitor",
                  1400,
                ]}
                wrapper="span"
                speed={45}
                repeat={Infinity}
              />
            </span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-muted">
            I ship production web apps with Next.js, TypeScript, PostgreSQL, and
            Flutter — from Roosevelt Connect&apos;s campus platform to telemedicine
            workloads measured in thousands of DB ops per session.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link
              href="#demo"
              className="rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-bg shadow-glow transition hover:bg-accent-blue-dim"
            >
              Open PokerLab
            </Link>
            <Link
              href="https://github.com/DevomB"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-white transition hover:border-accent-blue hover:text-accent-blue"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/devomb/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-white transition hover:border-accent-purple hover:text-accent-purple"
            >
              LinkedIn
            </Link>
            <Link
              href="#contact"
              className="rounded-full border border-accent-purple/45 px-6 py-3 text-sm font-semibold text-accent-purple transition hover:bg-accent-purple/10"
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
            className="relative flex h-52 w-52 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-glow lg:h-64 lg:w-64"
            aria-hidden
          >
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-accent-blue/22 to-accent-purple/18 blur-xl" />
            <span className="relative text-5xl font-black tracking-tight text-white lg:text-6xl">
              DB
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
