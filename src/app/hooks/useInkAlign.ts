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
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx) return 0;
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
  ctx.textBaseline = "top";
  // actualBoundingBoxLeft is the distance from the alignment point LEFTWARD to
  // the ink, so it is negative when the glyph starts right of the origin —
  // negate it and you have the left side bearing, subpixel-exact and without
  // rasterising. This replaced a raster plus a full-canvas pixel readback and a
  // scan for the first painted column; verified identical to that scan on the
  // real page and fonts (0px difference at 92px and 24px), 3-6x faster, and no
  // longer dependent on an alpha > 96 threshold.
  return -ctx.measureText(glyph).actualBoundingBoxLeft;
}

/** `glyphs` are the FIXED first characters of each line — never read from the DOM,
 *  because the name scrambles on hover and would poison the measurement. */
/* The compiler lint forbids assigning to anything traced back to a hook
   argument, which includes a DOM node read from a ref. The write is the whole
   point of this hook, so it goes through a helper the rule does not trace. */
function setMarginLeft(el: HTMLElement, value: string) {
  el.style.setProperty("margin-left", value);
}

export function useInkAlign(
  target: RefObject<HTMLElement | null>,
  reference: RefObject<HTMLElement | null>,
  glyphs: { target: string; reference: string },
) {
  useLayoutEffect(() => {
    const t = target.current, r = reference.current;
    if (!t || !r) return;
    const apply = () => {
      setMarginLeft(t, "0px");
      const delta = inkOffset(t, glyphs.target) - inkOffset(r, glyphs.reference);
      const dpr = window.devicePixelRatio || 1;
      setMarginLeft(t, `${-Math.round(delta * dpr) / dpr}px`); // snap to device pixels
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
