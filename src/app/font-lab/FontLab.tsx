"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Pairing = {
  id: string;
  name: string;
  blurb: string;
  display: string;
  displayName: string;
  body: string;
  bodyName: string;
  mono: string;
  monoName: string;
  /* display faces have very different natural weights */
  displayWeight: number;
  tracking: string;
  /* only for variable faces with extra axes (Anybody's width) */
  variation?: string;
};

const PAIRINGS: Pairing[] = [
  {
    id: "current",
    name: "Current",
    blurb: "What the site ships today. Here as the baseline to beat.",
    display: "var(--f-bricolage)", displayName: "Bricolage Grotesque",
    body: "var(--f-bricolage)", bodyName: "Bricolage Grotesque",
    mono: "var(--f-geist-mono)", monoName: "Geist Mono",
    displayWeight: 900, tracking: "-0.03em",
  },
  {
    id: "terminal",
    name: "Terminal",
    blurb:
      "The most on-theme for a backend and trading site: Plex reads as engineering documentation, Space Grotesk gives headings a technical edge. Safest pick, least distinctive.",
    display: "var(--f-space-grotesk)", displayName: "Space Grotesk",
    body: "var(--f-plex-sans)", bodyName: "IBM Plex Sans",
    mono: "var(--f-plex-mono)", monoName: "IBM Plex Mono",
    displayWeight: 700, tracking: "-0.03em",
  },
  {
    id: "console",
    name: "Console",
    blurb:
      "Mono-first: headings set in the monospace itself, tight and lowercase-friendly, with a neutral sans carrying body copy. This is the dev-tool look — Linear, Vercel docs, terminal UIs. Given the site is already full of // comments and a fake shell 404, it is the most honest fit, and one no template ships with.",
    display: "var(--f-geist-mono)", displayName: "Geist Mono",
    body: "var(--f-geist)", bodyName: "Geist",
    mono: "var(--f-geist-mono)", monoName: "Geist Mono",
    displayWeight: 700, tracking: "-0.05em",
  },
  {
    id: "expanse",
    name: "Expanse",
    blurb:
      "Anybody has a width axis, and this pairing runs it wide — headings stretched to 125% width, which is a shape almost nothing else on the web has. It makes the giant footer wordmark the loudest thing on the page without going condensed-poster. Instrument Sans stays completely out of its way underneath.",
    display: "var(--f-anybody)", displayName: "Anybody (expanded)",
    body: "var(--f-instrument-sans)", bodyName: "Instrument Sans",
    mono: "var(--f-geist-mono)", monoName: "Geist Mono",
    displayWeight: 800, tracking: "-0.02em",
    variation: '"wdth" 125',
  },
];

const BODY_COPY =
  "A from-scratch C++20 No-Limit Texas Hold'em engine covering the full dealing pipeline, betting phases, hand evaluation, and parallel Monte Carlo equity simulation. Built as an algorithms and systems playground — the same engine powers the PokerLab demo on this site.";

const CHIPS = ["C++20", "PostgreSQL", "Node", "Next.js", "N-API"];

export default function FontLab() {
  const [active, setActive] = useState(PAIRINGS[3]);

  const displayStyle = (p: Pairing, size?: string, weight?: number) => ({
    fontFamily: p.display,
    fontWeight: weight ?? p.displayWeight,
    letterSpacing: p.tracking,
    ...(p.variation ? { fontVariationSettings: p.variation } : {}),
    ...(size ? { fontSize: size } : {}),
  });

  return (
    <main className="min-h-screen bg-bg">
      <div className="page-shell">
        <header className="mb-8 max-w-2xl">
          <h1 className="text-fluid-4xl font-bold tracking-tight text-ink">Font Lab</h1>
          <p className="mt-3 text-fluid-base text-muted">
            Four pairings rendered against real site copy. Nothing here is applied
            to the site — this route loads its own fonts and is marked noindex.
            Pick one and I will wire it into the tokens.
          </p>
        </header>

        {/* switcher */}
        <div className="sticky top-0 z-10 -mx-[var(--shell-inline)] mb-10 border-b border-border bg-bg/95 px-[var(--shell-inline)] py-4 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {PAIRINGS.map((p) => {
              const on = p.id === active.id;
              const tone = on
                ? "border-accent bg-accent-bg text-accent-dim"
                : "border-border bg-surface text-muted hover:border-accent/40 hover:text-ink";
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p)}
                  className={"rounded-lg border px-4 py-2 font-mono text-fluid-xs transition-all " + tone}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-fluid-xs text-muted">
            {active.displayName}
            <span className="opacity-40"> · display</span>
            <span className="opacity-40"> / </span>
            {active.bodyName}
            <span className="opacity-40"> · body</span>
            <span className="opacity-40"> / </span>
            {active.monoName}
            <span className="opacity-40"> · mono</span>
          </p>
        </div>

        <p className="mb-12 max-w-2xl text-fluid-base leading-relaxed text-muted">
          {active.blurb}
        </p>

        {/* ---- specimen ---- */}
        <section className="space-y-14 pb-20">
          {/* the wordmark, at the size it actually ships */}
          <Block label="navbar wordmark — devomb.com">
            <div className="space-y-6">
              <div>
                <p className="mb-2 font-mono text-fluid-xs text-muted opacity-50">
                  as shipped — mono, navbar scale
                </p>
                <div className="flex h-14 items-center rounded-lg border border-border bg-surface px-5">
                  <span
                    className="text-fluid-sm font-semibold tracking-tight text-ink"
                    style={{ fontFamily: active.mono }}
                  >
                    devomb<span className="text-accent">.</span>com
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 font-mono text-fluid-xs text-muted opacity-50">
                  in the display face instead
                </p>
                <div className="flex h-14 items-center rounded-lg border border-border bg-surface px-5">
                  <span className="text-fluid-sm text-ink" style={displayStyle(active)}>
                    devomb<span className="text-accent">.</span>com
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 font-mono text-fluid-xs text-muted opacity-50">
                  blown up — mono / display / display caps
                </p>
                <div className="space-y-2">
                  <p
                    className="text-ink"
                    style={{
                      fontFamily: active.mono,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      fontSize: "clamp(1.8rem, 5vw, 3.4rem)",
                    }}
                  >
                    devomb<span className="text-accent">.</span>com
                  </p>
                  <p
                    className="text-ink"
                    style={displayStyle(active, "clamp(1.8rem, 5vw, 3.4rem)")}
                  >
                    devomb<span className="text-accent">.</span>com
                  </p>
                  <p
                    className="text-ink"
                    style={displayStyle(active, "clamp(1.8rem, 5vw, 3.4rem)")}
                  >
                    DEVOMB<span className="text-accent">.</span>COM
                  </p>
                </div>
              </div>
            </div>
          </Block>

          {/* hero */}
          <Block label="hero">
            <p
              className="mb-3 text-fluid-xs uppercase tracking-[0.2em] text-secondary"
              style={{ fontFamily: active.mono }}
            >
              portfolio / 2026
            </p>
            <h2
              className="leading-[0.95] text-ink"
              style={displayStyle(active, "clamp(2.6rem, 1.7rem + 3.8vw, 4.2rem)")}
            >
              Devom Brahmbhatt
            </h2>
            <p
              className="mt-4 text-fluid-lg text-muted"
              style={{ fontFamily: active.body }}
            >
              Trader · Engineer · Researcher
            </p>
          </Block>

          {/* section heading + body */}
          <Block label="section + body copy">
            <p
              className="mb-2 text-fluid-xs text-secondary"
              style={{ fontFamily: active.mono }}
            >
              {"// projects"}
            </p>
            <h3 className="text-fluid-4xl text-ink" style={displayStyle(active)}>
              Poker Engine
            </h3>
            <p
              className="mt-3 max-w-2xl text-fluid-base leading-relaxed text-muted"
              style={{ fontFamily: active.body }}
            >
              {BODY_COPY}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <span
                  key={c}
                  className="chip-soft px-3 py-1.5 text-fluid-xs"
                  style={{ fontFamily: active.mono }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Block>

          {/* mono / code */}
          <Block label="mono — terminal + code">
            <div className="overflow-hidden rounded-xl border border-accent/20 bg-code-bg">
              <div className="flex items-center justify-between border-b border-accent/10 px-4 py-2.5">
                <span className="text-fluid-xs text-accent-dim" style={{ fontFamily: active.mono }}>
                  npm
                </span>
                <span className="text-fluid-xs text-muted" style={{ fontFamily: active.mono }}>
                  copy
                </span>
              </div>
              <pre
                className="overflow-x-auto px-4 py-3 text-fluid-xs text-ink"
                style={{ fontFamily: active.mono }}
              >
                <span className="text-muted">$ </span>npm install poker-calculations
                {"\n"}
                <span className="text-muted">$ </span>equity --hero AhKh --board 7c8d9s --iters 250000
                {"\n"}
                <span className="text-secondary">{"✓ "}</span>62.4% · 1.8M sims/sec · seed 2463534242
              </pre>
            </div>
          </Block>

          {/* weight ladder */}
          <Block label="display weights">
            <div className="space-y-1">
              {[400, 600, 700, 800, 900].map((w) => (
                <p
                  key={w}
                  className="text-ink"
                  style={displayStyle(active, "clamp(1.4rem, 3vw, 2.2rem)", w)}
                >
                  <span className="mr-4 align-middle font-mono text-fluid-xs text-muted opacity-50">
                    {w}
                  </span>
                  Equity, backtests, and systems that hold up
                </p>
              ))}
            </div>
            <p className="mt-3 font-mono text-fluid-xs text-muted opacity-60">
              Faces that top out below 900 repeat their heaviest weight on the last
              rows — that is expected, not a bug.
            </p>
          </Block>

          {/* footer wordmark */}
          <Block label="footer wordmark">
            <p
              className="select-none overflow-hidden whitespace-nowrap text-center leading-none"
              style={{
                ...displayStyle(active, "clamp(2.8rem, 16.8vw, 20.8rem)"),
                color: "var(--color-accent-dim)",
              }}
            >
              DEVOM
            </p>
          </Block>

          {/* all five, same line */}
          <Block label="all four, same lines — click to switch">
            <div className="space-y-6">
              {PAIRINGS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p)}
                  className="block w-full text-left transition-opacity hover:opacity-70"
                >
                  <span className="font-mono text-fluid-xs text-muted opacity-60">
                    {p.name} — {p.displayName} / {p.monoName}
                  </span>
                  <span
                    className="mt-1 block text-ink"
                    style={displayStyle(p, "clamp(1.6rem, 4.5vw, 3rem)")}
                  >
                    Devom Brahmbhatt
                  </span>
                  <span
                    className="mt-0.5 block text-muted"
                    style={{
                      fontFamily: p.mono,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      fontSize: "clamp(1rem, 2.4vw, 1.5rem)",
                    }}
                  >
                    devomb<span className="text-accent">.</span>com
                  </span>
                </button>
              ))}
            </div>
          </Block>
        </section>
      </div>
    </main>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-4 border-b border-border pb-2 font-mono text-fluid-xs text-muted opacity-50">
        {label}
      </p>
      {children}
    </div>
  );
}
