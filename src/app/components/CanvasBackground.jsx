"use client";

import { useEffect, useRef } from "react";

function readCssVar(name, fallback) {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return raw || fallback;
}

export default function CanvasBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let t = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) paintStatic();
      else paintFrame();
    };

    const paintStatic = () => {
      const bg = readCssVar("--color-bg", "#000000");
      const blue = readCssVar("--color-accent-blue", "#5b9dff");
      const purple = readCssVar("--color-accent-purple", "#a78bfa");
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, bg);
      g.addColorStop(0.5, `${blue}10`);
      g.addColorStop(1, `${purple}0d`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = `${purple}14`;
      ctx.lineWidth = 1;
      const step = 56;
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
      const bg = readCssVar("--color-bg", "#000000");
      const blue = readCssVar("--color-accent-blue", "#5b9dff");
      const purple = readCssVar("--color-accent-purple", "#a78bfa");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        {
          x: w * 0.18 + Math.sin(t * 0.00035) * 48,
          y: h * 0.28,
          c: `${blue}20`,
          r: Math.min(w, h) * 0.38,
        },
        {
          x: w * 0.78 + Math.cos(t * 0.00032) * 56,
          y: h * 0.68,
          c: `${purple}18`,
          r: Math.min(w, h) * 0.32,
        },
        {
          x: w * 0.52 + Math.sin(t * 0.00022 + 1.2) * 40,
          y: h * 0.48,
          c: `${blue}12`,
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

      ctx.strokeStyle = `${purple}12`;
      ctx.lineWidth = 1;
      const phase = t * 0.018;
      const step = 64;
      for (let x = -step; x < w + step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + phase % step, 0);
        ctx.lineTo(x + phase % step + h * 0.06, h);
        ctx.stroke();
      }

      ctx.strokeStyle = `${blue}0f`;
      for (let y = -step; y < h + step; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + phase % step);
        ctx.lineTo(w, y + phase % step + w * 0.04);
        ctx.stroke();
      }
    };

    const loop = () => {
      if (!running) return;
      if (!document.hidden && !reducedMotion) {
        t++;
        paintFrame();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) return;
      if (reducedMotion) paintStatic();
      else paintFrame();
    };

    resize();

    if (!reducedMotion) rafRef.current = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
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
