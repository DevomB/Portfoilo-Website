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

  const linkBtn =
    "inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-6 text-fluid-sm font-semibold text-ink transition hover:bg-white sm:min-h-0";

  return (
    <section id="contact" className="scroll-mt-28 section-y">
      <div className="card-soft p-6 sm:p-10 md:p-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <p className="text-fluid-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Contact
            </p>
            <h2 className="font-heading mt-3 text-fluid-3xl font-semibold tracking-tight text-ink">
              Ways to reach me
            </h2>
            <p className="prose-readable mt-4 text-fluid-sm leading-relaxed text-muted">
              LinkedIn and GitHub below. Email appears here if{" "}
              <code className="rounded-md border border-border bg-surface-elevated px-1.5 py-0.5 text-fluid-xs text-accent-purple">
                NEXT_PUBLIC_CONTACT_EMAIL
              </code>{" "}
              is set (e.g. in Vercel env).
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkBtn}
              >
                <CodeBracketIcon className="h-5 w-5 shrink-0" />
                GitHub
              </Link>
              <Link
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkBtn}
              >
                <Image src={LinkedinIcon} alt="" width={20} height={20} />
                LinkedIn
              </Link>
              {email ? (
                <Link
                  href={`mailto:${encodeURIComponent(email)}`}
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full border border-accent-blue/40 bg-accent-blue/10 px-6 text-fluid-sm font-semibold text-accent-blue transition hover:bg-accent-blue/[0.16] sm:min-h-0"
                >
                  Email · {email}
                </Link>
              ) : null}
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-bg/80 p-6 text-fluid-sm text-muted">
            <p className="font-heading font-semibold text-ink">Hosting</p>
            <p className="mt-3 leading-relaxed">
              Next.js on Vercel. PokerLab equity runs on the server via the{" "}
              <span className="font-medium text-accent-purple">
                poker-calculations
              </span>{" "}
              native engine (Monte Carlo vs one random villain); the browser only
              sends inputs and renders the response.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
