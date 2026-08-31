"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Measures the left side-bearing (px between the layout box edge and the first
 * painted pixel) of the first glyph of `target` and `reference`, then shifts
 * `target` left/right so both lines' ink edges coincide exactly. Recomputed on
 * resize and when fonts finish loading, so it stays pixel-exact per device.
 */
function inkOffset(el: HTMLElement, glyph: string): number {
  if (!glyph) return 0;
  const cs = getComputedStyle(el);
  const size = parseFloat(cs.fontSize);
  const dpr = window.devicePixelRatio || 1;
  const pad = Math.ceil(size * 0.5);
  const w = Math.ceil((size * 1.5 + pad) * dpr); // integer device px
  const h = Math.ceil(size * 1.4 * dpr);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return 0;
  ctx.scale(dpr, dpr);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "#fff";
  ctx.fillText(glyph, pad, size * 0.1);
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let x = 0; x < w; x++)
    for (let y = 0; y < h; y++)
      if (data[(y * w + x) * 4 + 3]! > 96) return x / dpr - pad; // first painted column, in CSS px
  return 0;
}

/** `glyphs` are the FIXED first characters of each line — never read from the DOM,
 *  because the name scrambles on hover and would poison the measurement. */
export function useInkAlign(
  target: RefObject<HTMLElement | null>,
  reference: RefObject<HTMLElement | null>,
  glyphs: { target: string; reference: string },
) {
  useLayoutEffect(() => {
    const t = target.current, r = reference.current;
    if (!t || !r) return;
    const apply = () => {
      t.style.marginLeft = "0px";
      const delta = inkOffset(t, glyphs.target) - inkOffset(r, glyphs.reference);
      const dpr = window.devicePixelRatio || 1;
      t.style.marginLeft = `${-Math.round(delta * dpr) / dpr}px`; // snap to device pixels
    };
    apply();
    // The page now mounts under the splash, by which time the fonts have
    // usually already resolved — re-measuring then is a wasted double pass
    // (two canvas rasters + getComputedStyle) inside the hand-off task.
    if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(apply);
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [target, reference, glyphs.target, glyphs.reference]);
}
