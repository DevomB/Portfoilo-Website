"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fullDeck, mulberry32, shuffleInPlace } from "@/lib/pokerCards";

// ── Geometry ──────────────────────────────────────────────────────────────────
// A fixed pixel design scaled as one composition to fit any viewport, so the fan
// and the name inside it always hold the same proportions.
const BOX = 580;      // design canvas (square) — sized to clear the pulled-out cards
const COUNT = 36;     // cards in the fan
const CARD_W = 52;
const CARD_H = 74;
const RING_R = 210;   // canvas centre → card centre
const LIFT = 26;      // extra radius for a card pulled out of the fan
const SEED = 0xc0ffee;

// Cards that turn face-up once the fan has opened, spread around the ring.
const REVEALED = [3, 10, 17, 24, 31];

const RANKS = "23456789TJQKA";
const SUITS = ["♣", "♦", "♥", "♠"];
const isRed = (suit: number) => suit === 1 || suit === 2;

const ease = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];
const easeOut = [0.16, 0.84, 0.34, 1] as [number, number, number, number];

// ── Choreography (seconds) ────────────────────────────────────────────────────
const FAN_START = 0.45;
const FAN_STEP = 0.012;
const FAN_DUR = 0.65;
const FAN_END = FAN_START + (COUNT - 1) * FAN_STEP + FAN_DUR;
const REVEAL_START = FAN_END - 0.1;
const REVEAL_STEP = 0.08;
const REVEAL_DUR = 0.45;
const NAME_AT = 1.3;
const HOLD = 2.95; // onComplete

// ── Card faces ────────────────────────────────────────────────────────────────
function CardBack() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 6,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        border: "1px solid rgb(var(--brand-purple-rgb) / 0.5)",
        background: `
          repeating-linear-gradient(45deg, rgb(var(--brand-purple-rgb) / 0.28) 0 2px, transparent 2px 5px),
          repeating-linear-gradient(-45deg, rgb(var(--brand-purple-rgb) / 0.28) 0 2px, transparent 2px 5px),
          linear-gradient(155deg, var(--color-surface-elevated) 0%, var(--color-surface) 100%)
        `,
        boxShadow:
          "inset 0 0 0 3px rgb(var(--brand-black-rgb) / 0.62), inset 0 0 0 4px rgb(var(--brand-purple-rgb) / 0.3), 0 2px 8px rgb(var(--brand-black-rgb) / 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          width: 11,
          height: 11,
          transform: "rotate(45deg)",
          border: "1px solid rgb(var(--brand-green-rgb) / 0.55)",
          background: "rgb(var(--brand-green-rgb) / 0.1)",
        }}
      />
    </div>
  );
}

function CardFace({ rank, suit }: { rank: number; suit: number }) {
  const color = isRed(suit) ? "var(--color-card-red)" : "var(--color-card-black)";
  const glyph = SUITS[suit];
  const label = RANKS[rank - 2];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 6,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        background: "linear-gradient(160deg, var(--color-card-face) 0%, var(--color-card-face-2) 100%)",
        border: "1px solid var(--color-card-edge)",
        boxShadow:
          "0 4px 14px rgb(var(--brand-black-rgb) / 0.75), 0 0 0 2px rgb(var(--brand-purple-rgb) / 0.28)",
      }}
    >
      <div style={{ position: "absolute", top: 4, left: 5, color, lineHeight: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 800, fontFamily: "var(--font-mono), monospace" }}>{label}</div>
        <div style={{ fontSize: 8, marginTop: 1 }}>{glyph}</div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          fontSize: 24,
        }}
      >
        {glyph}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 4,
          right: 5,
          color,
          lineHeight: 1,
          transform: "rotate(180deg)",
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800 }}>{label}</div>
        <div style={{ fontSize: 8, marginTop: 1 }}>{glyph}</div>
      </div>
    </div>
  );
}

// ── Splash ────────────────────────────────────────────────────────────────────
export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion() ?? false;
  const [fanned, setFanned] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [scale, setScale] = useState(1);

  const onCompleteRef = useRef(onComplete);
  const doneRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onCompleteRef.current();
  }, []);

  // Deterministic shuffle — identical on server and client, no hydration drift.
  const deck = useMemo(() => {
    const cards = fullDeck();
    shuffleInPlace(cards, mulberry32(SEED));
    return cards.slice(0, COUNT);
  }, []);

  // Fit the whole composition to the viewport. CSS cannot divide a length by a
  // number to get a scale factor, so the ratio is measured here instead.
  useEffect(() => {
    const fit = () =>
      setScale(Math.min(1, (window.innerWidth - 32) / BOX, (window.innerHeight - 48) / BOX));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setFanned(true), reduce ? 0 : FAN_START * 1000),
      setTimeout(() => setRevealing(true), reduce ? 0 : REVEAL_START * 1000),
      setTimeout(finish, reduce ? 900 : HOLD * 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reduce, finish]);

  // Any deliberate input cuts the intro short.
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [finish]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden select-none"
      style={{ background: "var(--color-bg)" }}
      exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.45, ease: "easeIn" } }}
    >
      {/* purple wash behind the fan */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: "70vmax",
          height: "70vmax",
          background: "radial-gradient(circle, rgb(var(--brand-purple-rgb) / 0.16) 0%, transparent 62%)",
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: BOX,
          height: BOX,
          flexShrink: 0,
          transform: `scale(${scale})`,
        }}
      >
        {/* The deck: stacked, then spun open into a full circle */}
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { rotate: -14, scale: 0.94, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0.3 : 1.9, ease: easeOut }}
        >
          {deck.map((card, i) => {
            const angle = (i * 360) / COUNT;
            const revealed = REVEALED.includes(i);
            // A revealed card only pulls out of the fan once its turn to flip arrives.
            const showing = revealed && revealing;
            const radius = RING_R + (showing ? LIFT : 0);
            const revealDelay = reduce ? 0 : REVEALED.indexOf(i) * REVEAL_STEP;

            return (
              <motion.div
                key={i}
                // arm — rotates about the canvas centre, carrying the card outward
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  zIndex: revealed ? 10 : 1,
                }}
                initial={reduce ? false : { rotate: 0, opacity: 0 }}
                animate={
                  fanned
                    ? { rotate: reduce ? angle : angle + 360, opacity: 1 }
                    : { rotate: (i % 2 ? 1 : -1) * (2 + (i % 5)), opacity: 1 }
                }
                transition={
                  fanned
                    ? {
                        rotate: {
                          duration: reduce ? 0.3 : FAN_DUR,
                          delay: reduce ? 0 : i * FAN_STEP,
                          ease: easeOut,
                        },
                        opacity: { duration: 0.2 },
                      }
                    : { duration: 0.35, delay: 0.08 + i * 0.008, ease }
                }
              >
                <motion.div
                  // Radial offset along the arm's rotated axis. A card that is being
                  // shown also cancels its arm's rotation so the face reads upright.
                  style={{ width: "100%", height: "100%", perspective: 700 }}
                  initial={reduce ? false : { y: 0, rotate: 0 }}
                  animate={{ y: fanned ? -radius : 0, rotate: showing ? -angle : 0 }}
                  transition={{
                    duration: reduce ? 0.3 : revealing ? REVEAL_DUR : FAN_DUR,
                    delay: reduce ? 0 : revealing ? revealDelay : i * FAN_STEP,
                    ease: easeOut,
                  }}
                >
                  <motion.div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                    }}
                    initial={reduce ? false : { rotateY: 0 }}
                    animate={{ rotateY: showing ? 180 : 0 }}
                    transition={{ duration: reduce ? 0.3 : REVEAL_DUR, delay: revealDelay, ease }}
                  >
                    <CardBack />
                    <CardFace rank={card.rank} suit={card.suit} />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Name sits in the hole of the fan and never rotates with it */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.h1
            className="font-sans font-black tracking-tight leading-none whitespace-nowrap"
            style={{ fontSize: 30, color: "var(--color-accent-dim)", letterSpacing: "-0.03em" }}
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduce ? 0.3 : 0.7, delay: reduce ? 0 : NAME_AT, ease }}
          >
            Devom Brahmbhatt
          </motion.h1>
          <motion.p
            className="font-mono whitespace-nowrap"
            style={{ fontSize: 11, marginTop: 10, color: "var(--color-muted)", letterSpacing: "0.14em" }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.3 : 0.6, delay: reduce ? 0 : NAME_AT + 0.16, ease }}
          >
            TRADER · ENGINEER · RESEARCHER
          </motion.p>
        </div>
      </div>

      {/* skip hint */}
      <motion.p
        className="absolute font-mono"
        style={{
          bottom: "max(1.75rem, env(safe-area-inset-bottom, 0px) + 1rem)",
          fontSize: "0.58rem",
          letterSpacing: "0.16em",
          color: "var(--color-muted)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 1.9 }}
      >
        CLICK TO SKIP
      </motion.p>
    </motion.div>
  );
}
