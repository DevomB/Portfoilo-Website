"use client";

import { useEffect, useRef } from "react";

function readCssVar(name, fallback) {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return raw || fallback;
}

function coarsePointerPreferred() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(pointer: none)").matches
  );
}

/** Lite mode: narrower viewports or touch-first pointers get a static-ish gradient instead of diagonal line animation every frame */
function shouldUseLiteBackground(width) {
  if (width <= 0) return true;
  if (width < 768) return true;
  return coarsePointerPreferred();
}

export default function CanvasBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let w = 0;
    let h = 0;
    let t = 0;
    let running = true;

    const paintLite = () => {
      const bg = readCssVar("--color-bg", "#0b0d10");
      const blue = readCssVar("--color-accent-blue", "#4285f4");
      const purple = readCssVar("--color-accent-purple", "#7c6fd6");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const bx = w * 0.22;
      const by = h * 0.32;
      const br = Math.min(w, h) * 0.42;
      const rg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      rg.addColorStop(0, `${blue}12`);
      rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);

      const bx2 = w * 0.78;
      const by2 = h * 0.72;
      const br2 = Math.min(w, h) * 0.36;
      const rg2 = ctx.createRadialGradient(bx2, by2, 0, bx2, by2, br2);
      rg2.addColorStop(0, `${purple}0e`);
      rg2.addColorStop(1, "transparent");
      ctx.fillStyle = rg2;
      ctx.fillRect(0, 0, w, h);
    };

    const paintStatic = () => {
      const bg = readCssVar("--color-bg", "#0b0d10");
      const blue = readCssVar("--color-accent-blue", "#4285f4");
      const purple = readCssVar("--color-accent-purple", "#7c6fd6");
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, bg);
      g.addColorStop(0.52, `${blue}0a`);
      g.addColorStop(1, `${purple}09`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = `${purple}0c`;
      ctx.lineWidth = 1;
      const step = Math.max(72, Math.min(w, h) / 14);
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const paintFrame = () => {
      const bg = readCssVar("--color-bg", "#0b0d10");
      const blue = readCssVar("--color-accent-blue", "#4285f4");
      const purple = readCssVar("--color-accent-purple", "#7c6fd6");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        {
          x: w * 0.18 + Math.sin(t * 0.00035) * 48,
          y: h * 0.28,
          c: `${blue}14`,
          r: Math.min(w, h) * 0.38,
        },
        {
          x: w * 0.78 + Math.cos(t * 0.00032) * 56,
          y: h * 0.68,
          c: `${purple}12`,
          r: Math.min(w, h) * 0.32,
        },
        {
          x: w * 0.52 + Math.sin(t * 0.00022 + 1.2) * 40,
          y: h * 0.48,
          c: `${blue}0d`,
          r: Math.min(w, h) * 0.45,
        },
      ];

      for (const b of blobs) {
        const rg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        rg.addColorStop(0, b.c);
        rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.strokeStyle = `${purple}0a`;
      ctx.lineWidth = 1;
      const phase = t * 0.014;
      const step = Math.max(64, Math.min(w, h) / 12);
      for (let x = -step; x < w + step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + phase % step, 0);
        ctx.lineTo(x + phase % step + h * 0.045, h);
        ctx.stroke();
      }

      ctx.strokeStyle = `${blue}09`;
      for (let y = -step; y < h + step; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + phase % step);
        ctx.lineTo(w, y + phase % step + w * 0.03);
        ctx.stroke();
      }
    };

    const stopLoop = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };

    const restartMode = () => {
      stopLoop();

      const reducedMotion = mqReduce.matches;
      const lite = shouldUseLiteBackground(w);

      if (reducedMotion) {
        paintStatic();
        return;
      }
      if (lite) {
        paintLite();
        return;
      }

      if (document.hidden) {
        return;
      }

      const tick = () => {
        if (!running || document.hidden) return;
        if (mqReduce.matches || shouldUseLiteBackground(w)) {
          restartMode();
          return;
        }
        t++;
        paintFrame();
        rafRef.current = requestAnimationFrame(tick);
      };
      paintFrame();
      rafRef.current = requestAnimationFrame(tick);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      restartMode();
    };

    const onVisibility = () => {
      if (document.hidden) {
        stopLoop();
        return;
      }
      restartMode();
    };

    const onMotionChange = () => {
      restartMode();
    };

    resize();
    mqReduce.addEventListener("change", onMotionChange);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      stopLoop();
      mqReduce.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
