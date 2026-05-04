"use client";

import Image from "next/image";
import Link from "next/link";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import LinkedinIcon from "../../../public/linkedin-icon.svg";

const githubHref = "https://github.com/DevomB";
const linkedinHref = "https://www.linkedin.com/in/devomb/";

export default function ContactSection() {
  const email =
    typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL === "string"
      ? process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()
      : "";

  return (
    <section id="contact" className="scroll-mt-28 py-16 md:py-24">
      <div className="rounded-2xl border border-border bg-surface/80 p-8 shadow-glow backdrop-blur-md md:p-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Let&apos;s build something measurable.
            </h2>
            <p className="mt-4 text-muted">
              No inbox middleware — reach me directly on LinkedIn or GitHub.
              Optional mailto unlocks when{" "}
              <code className="rounded bg-surface-elevated px-1 text-accent-purple">
                NEXT_PUBLIC_CONTACT_EMAIL
              </code>{" "}
              is set in Vercel.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-white transition hover:border-accent-blue hover:text-accent-blue"
              >
                <CodeBracketIcon className="h-5 w-5" />
                GitHub
              </Link>
              <Link
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-white transition hover:border-accent-purple hover:text-accent-purple"
              >
                <Image src={LinkedinIcon} alt="" width={20} height={20} />
                LinkedIn
              </Link>
              {email ? (
                <Link
                  href={`mailto:${encodeURIComponent(email)}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-accent-purple/45 bg-accent-purple/10 px-5 py-3 text-sm font-semibold text-accent-purple transition hover:bg-accent-purple/18"
                >
                  Email · {email}
                </Link>
              ) : null}
            </div>
          </div>
          <div className="rounded-xl border border-dashed border-accent-purple/35 bg-bg/60 p-6 text-sm text-muted">
            <p className="font-semibold text-white">Deploy narrative</p>
            <p className="mt-3 leading-relaxed">
              Static-first Next.js + edge CDN on Vercel. PokerLab ships entirely client-side — deterministic RNG,
              chunked Monte Carlo batches with{" "}
              <span className="text-accent-purple">requestAnimationFrame</span> yields, no secrets on-server.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
