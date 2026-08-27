"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";


const BOOT_LINES = [
  { level: "sys",  text: "Linux devomb-server 6.8.0 #1 SMP x86_64 GNU/Linux" },
  { level: "ok",   text: "Started Local File Systems" },
  { level: "ok",   text: "Started Network Manager" },
  { level: "ok",   text: "Started OpenSSH Server Daemon" },
  { level: "sys",  text: "systemd[1]: Reached target Multi-User System" },
  { level: "info", text: "postgres[1842]: starting PostgreSQL 16.2 on x86_64-pc-linux-gnu" },
  { level: "ok",   text: "postgres[1842]: listening on port 5432, max_connections=200" },
  { level: "info", text: "postgres[1842]: running 14 pending migrations" },
  { level: "ok",   text: "postgres[1842]: migrations complete, 14 applied (127ms)" },
  { level: "info", text: "redis[2109]: Redis 7.2.4 starting · pid=2109 · port=6379" },
  { level: "ok",   text: "redis[2109]: Server initialized, accepting connections" },
  { level: "info", text: "redis[2109]: loading RDB snapshot (12.4 MB)" },
  { level: "ok",   text: "redis[2109]: RDB loaded in 0.31s · keys=42834" },
  { level: "info", text: "node[3001]: env=production commit=8f893d1 region=us-west-2" },
  { level: "ok",   text: "node[3001]: PostgreSQL pool ready (max=20)" },
  { level: "ok",   text: "node[3001]: Redis connected at localhost:6379" },
  { level: "info", text: "node[3001]: registering API routes" },
  { level: "ok",   text: "node[3001]: /api/projects    GET  (12 handlers)" },
  { level: "ok",   text: "node[3001]: /api/equity      POST (Monte Carlo)" },
  { level: "ok",   text: "node[3001]: /api/health      GET" },
  { level: "ok",   text: "node[3001]: API server listening on :3000" },
  { level: "info", text: "nginx[4401]: config test OK · worker_processes=auto" },
  { level: "ok",   text: "nginx[4401]: start worker process 4402" },
  { level: "ok",   text: "nginx[4401]: TLS certificate valid until 2027-01-22" },
  { level: "info", text: "worker[5001]: Monte Carlo equity engine (threads=8)" },
  { level: "ok",   text: "worker[5001]: throughput ≈ 1.2M iter/s · status=ready" },
  { level: "info", text: "telemetry: initializing OpenTelemetry tracer" },
  { level: "ok",   text: "telemetry: traces  → otel-collector:4317" },
  { level: "ok",   text: "telemetry: metrics → prometheus:9090" },
  { level: "ok",   text: "cron[6001]: scheduled jobs registered (3 active)" },
  { level: "sys",  text: "All services nominal. uptime=0d 0h 0m 1.4s ✓" },
];

const LINE_STAGGER = 82;
const COMPLETE_DELAY = 650;

function levelColor(level: string) {
  if (level === "ok")   return "var(--color-ok)";
  if (level === "sys")  return "rgb(var(--brand-purple-rgb) / 0.95)";
  return "var(--color-muted)";
}

function levelTag(level: string) {
  if (level === "ok")   return " OK  ";
  if (level === "sys")  return " SYS ";
  return "INFO ";
}

const ease = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 320 + i * LINE_STAGGER));
    });
    timers.push(
      setTimeout(
        () => onCompleteRef.current(),
        320 + BOOT_LINES.length * LINE_STAGGER + COMPLETE_DELAY
      )
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center overflow-hidden"
      style={{ background: "var(--color-bg)" }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
    >
      {/* Name + subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col items-center text-center select-none"
        style={{ marginTop: "clamp(3.5rem, 11vh, 7rem)" }}
      >
        <h1
          className="font-sans font-black tracking-tight leading-none"
          style={{
            fontSize: "clamp(2rem, 4vw + 0.5rem, 3.8rem)",
            color: "var(--color-accent)",
            letterSpacing: "-0.025em",
          }}
        >
          Devom Brahmbhatt
        </h1>
        <p
          className="font-sans font-semibold tracking-tight mt-2"
          style={{
            fontSize: "clamp(0.85rem, 1.5vw + 0.2rem, 1.15rem)",
            color: "var(--color-muted)",
            letterSpacing: "-0.01em",
          }}
        >
          Backend Software Engineer
        </p>
      </motion.div>

      {/* Terminal — tall enough to overflow below the viewport */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.32, ease }}
        style={{
          marginTop: "clamp(1.2rem, 2.5vh, 2rem)",
          width: "min(700px, calc(100vw - 2rem))",
          height: "65vh",
          flexShrink: 0,
          background: "var(--color-surface)",
          border: "1px solid rgb(var(--brand-purple-rgb) / 0.2)",
          borderBottom: "none",
          borderRadius: "10px 10px 0 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Chrome */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 14px",
            borderBottom: "1px solid rgb(var(--brand-purple-rgb) / 0.13)",
            background: "rgb(var(--brand-purple-rgb) / 0.045)",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-danger)", flexShrink: 0 }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-warn)", flexShrink: 0 }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-ok)", flexShrink: 0 }} />
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.58rem",
              color: "rgb(var(--brand-purple-rgb) / 0.45)",
              letterSpacing: "0.05em",
            }}
          >
            boot.log — devomb-server
          </span>
        </div>

        {/* Log output */}
        <div
          style={{
            flex: 1,
            padding: "12px 14px 0",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "clamp(0.58rem, 0.9vw + 0.1rem, 0.7rem)",
            lineHeight: 1.7,
            overflowY: "hidden",
          }}
        >
          {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.12 }}
              style={{ display: "flex", gap: "8px" }}
            >
              <span
                style={{
                  flexShrink: 0,
                  color: levelColor(line.level),
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  fontSize: "0.56rem",
                  alignSelf: "baseline",
                  marginTop: "0.2em",
                  whiteSpace: "nowrap",
                }}
              >
                [{levelTag(line.level)}]
              </span>
              <span style={{ color: "var(--color-ink)" }}>{line.text}</span>
            </motion.div>
          ))}

          {visibleCount > 0 && visibleCount < BOOT_LINES.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatType: "mirror" }}
              style={{
                display: "inline-block",
                width: "0.45em",
                height: "0.85em",
                background: "rgb(var(--brand-purple-rgb) / 0.65)",
                verticalAlign: "text-bottom",
                marginLeft: "2px",
                borderRadius: "1px",
              }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
