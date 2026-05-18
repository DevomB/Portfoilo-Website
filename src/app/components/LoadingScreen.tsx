"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!&*><";
const FULL_NAME = "Devom Brahmbatt";

const SQL_GHOSTS = [
  { text: "SELECT * FROM projects WHERE featured = true ORDER BY created_at DESC;", top: "18%", left: "-1%", rotate: -1.5 },
  { text: "EXPLAIN ANALYZE SELECT * FROM sessions WHERE user_id = $1 AND active = true;", top: "78%", right: "-1%", rotate: 1 },
];

function useMatrixDecode(active: boolean, delay = 250) {
  const [display, setDisplay] = useState("");
  const frameRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!active) return;

    timeoutRef.current = setTimeout(() => {
      frameRef.current = 0;
      intervalRef.current = setInterval(() => {
        const resolved = Math.floor(frameRef.current / 2);
        setDisplay(
          FULL_NAME.split("").map((char, i) => {
            if (char === " ") return " ";
            if (i < resolved) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );
        frameRef.current++;
        if (resolved >= FULL_NAME.length) {
          clearInterval(intervalRef.current);
          setDisplay(FULL_NAME);
        }
      }, 38);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [active, delay]);

  return display;
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const decoded = useMatrixDecode(true, 250);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let raf: number;
    const DELAY = 600;
    const DURATION = 1500;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(100, (elapsed / DURATION) * 100);
        setProgress(p);
        if (p < 100) {
          raf = requestAnimationFrame(tick);
        } else {
          setTimeout(() => setShowReady(true), 120);
          setTimeout(() => onCompleteRef.current(), 520);
        }
      };
      raf = requestAnimationFrame(tick);
    }, DELAY);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Blue canvas that iris-closes to reveal the cream site beneath */}
      <motion.div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#276787" }}
        initial={{ clipPath: "circle(150% at 50% 50%)" }}
        exit={{
          clipPath: "circle(0% at 50% 50%)",
          transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
        }}
      >
        {/* scanlines */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)",
          }}
          aria-hidden
        />

        {/* SQL ghost text */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {SQL_GHOSTS.map((g, i) => (
            <span
              key={i}
              className="absolute font-mono text-[0.55rem] whitespace-nowrap select-none"
              style={{
                top: g.top,
                left: "left" in g ? (g as typeof g & { left: string }).left : undefined,
                right: "right" in g ? (g as typeof g & { right: string }).right : undefined,
                transform: `rotate(${g.rotate}deg)`,
                color: "rgba(250,245,230,0.12)",
              }}
            >
              {g.text}
            </span>
          ))}
        </div>

        {/* label */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-mono text-[0.65rem] tracking-[0.35em] uppercase"
          style={{ color: "rgba(250,245,230,0.55)", marginBottom: "5rem" }}
        >
          // devomb.com
        </motion.p>

        {/* invisible placeholder keeps layout centred while the floating name is above */}
        <div
          aria-hidden
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)",
            letterSpacing: "-0.03em",
            fontWeight: 900,
            lineHeight: 1,
            visibility: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {FULL_NAME}
        </div>

        {/* progress bar */}
        <div
          className="overflow-hidden rounded-full"
          style={{
            width: "min(240px, 60vw)",
            height: "1px",
            background: "rgba(250,245,230,0.14)",
            marginTop: "3rem",
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "rgba(250,245,230,0.85)",
              transition: "width 16ms linear",
            }}
          />
        </div>

        <div
          className="mt-2.5 flex items-center justify-between"
          style={{ width: "min(240px, 60vw)" }}
        >
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: "0.6rem", color: "rgba(250,245,230,0.35)" }}
          >
            {Math.round(progress)}%
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: showReady ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono"
            style={{ fontSize: "0.6rem", color: "rgba(250,245,230,0.9)" }}
          >
            ready ✓
          </motion.span>
        </div>
      </motion.div>

      {/* Name centered — fades out with the iris close */}
      <motion.div
        className="pointer-events-none fixed z-[201] select-none font-sans font-black leading-none"
        style={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)",
          letterSpacing: "-0.03em",
          color: "#faf5e6",
          whiteSpace: "nowrap",
        }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
      >
        {decoded || <span style={{ opacity: 0 }}>{FULL_NAME}</span>}
      </motion.div>
    </>
  );
}
