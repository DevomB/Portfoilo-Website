"use client";

import { useEffect, useRef } from "react";

// One canvas, one rAF loop, a fixed particle budget, and it tears itself down
// when the last particle leaves the screen — confetti with none of the DOM cost.
// Colors are the brand palette: royal purple, joker green, card-face white.
const COLORS = ["#7c00ff", "#a35cff", "#09ff00", "#5cff55", "#f2eefa"];

type Particle = {
  x: number; y: number;      // px (CSS space)
  vx: number; vy: number;    // px/s
  w: number; h: number;
  rot: number; vr: number;   // rad, rad/s
  phase: number; freq: number; amp: number; // flutter
  born: number;              // s, spawn offset from start
  life: number;              // s
  color: string;
};

export default function SplashConfetti({
  delayMs,
  count,
  rain = false,
}: {
  delayMs: number;
  count: number;
  /** big hands also get a drizzle from the top edge */
  rain?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let stopped = false;

    const timer = setTimeout(() => {
      if (stopped) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      const rand = (a: number, b: number) => a + Math.random() * (b - a);
      const particles: Particle[] = [];

      // two cannons at the bottom corners, firing up and inward
      const burstCount = rain ? Math.floor(count * 0.7) : count;
      for (let i = 0; i < burstCount; i++) {
        const left = i % 2 === 0;
        const angle = ((left ? -75 : -105) + rand(-14, 14)) * (Math.PI / 180);
        const speed = rand(0.85, 1.55) * H;
        particles.push({
          x: left ? W * 0.06 : W * 0.94,
          y: H * 0.98,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          w: rand(5, 9),
          h: rand(8, 14),
          rot: rand(0, Math.PI * 2),
          vr: rand(-9, 9),
          phase: rand(0, Math.PI * 2),
          freq: rand(3, 7),
          amp: rand(8, 26),
          born: rand(0, 0.18),
          life: rand(2.0, 3.0),
          color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        });
      }
      // top drizzle for the monsters
      if (rain) {
        for (let i = burstCount; i < count; i++) {
          particles.push({
            x: rand(0, W),
            y: rand(-H * 0.12, -10),
            vx: rand(-30, 30),
            vy: rand(60, 160),
            w: rand(5, 9),
            h: rand(8, 14),
            rot: rand(0, Math.PI * 2),
            vr: rand(-7, 7),
            phase: rand(0, Math.PI * 2),
            freq: rand(2, 5),
            amp: rand(14, 34),
            born: rand(0.1, 1.1),
            life: rand(2.6, 3.6),
            color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
          });
        }
      }

      const gravity = 1.35 * H;   // px/s² — scaled so arcs read the same at any size
      const drag = 0.9;           // per second
      let last = performance.now();
      const t0 = last;

      const frame = (now: number) => {
        if (stopped) return;
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;
        const elapsed = (now - t0) / 1000;

        ctx.clearRect(0, 0, W, H);
        const slow = Math.pow(drag, dt); // loop-invariant per frame
        let alive = 0;
        for (const p of particles) {
          const age = elapsed - p.born;
          if (age < 0) { alive++; continue; }
          if (age > p.life || p.y > H + 24) continue;
          alive++;

          p.vx *= slow;
          p.vy = p.vy * slow + gravity * dt;
          p.x += p.vx * dt + Math.sin(p.phase + age * p.freq) * p.amp * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;

          const fade = age > p.life * 0.72 ? 1 - (age - p.life * 0.72) / (p.life * 0.28) : 1;
          ctx.globalAlpha = Math.max(0, fade);
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          // cos gives the tumble a 3D read for free
          const tumble = Math.cos(age * p.freq);
          ctx.fillRect(-p.w / 2, (-p.h / 2) * tumble, p.w, p.h * Math.abs(tumble) + 1);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.globalAlpha = 1;

        if (alive > 0 && elapsed < 5) {
          raf = requestAnimationFrame(frame);
        } else {
          ctx.clearRect(0, 0, W, H);
        }
      };
      raf = requestAnimationFrame(frame);
    }, delayMs);

    return () => {
      stopped = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [delayMs, count, rain]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 30, width: "100%", height: "100%" }}
    />
  );
}
