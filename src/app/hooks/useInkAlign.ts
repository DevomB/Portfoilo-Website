"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Measures the left side-bearing (px between the layout box edge and the first
 * painted pixel) of the first glyph of `target` and `reference`, then shifts
 * `target` left/right so both lines' ink edges coincide exactly. Recomputed on
 * resize and when fonts finish loading, so it stays pixel-exact per device.
 */
function inkOffset(el: HTMLElement): number {
  const text = (el.textContent ?? "").trim();
  if (!text) return 0;
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
  ctx.fillText(text[0]!, pad, size * 0.1);
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let x = 0; x < w; x++)
    for (let y = 0; y < h; y++)
      if (data[(y * w + x) * 4 + 3]! > 96) return x / dpr - pad; // first painted column, in CSS px
  return 0;
}

export function useInkAlign(target: RefObject<HTMLElement | null>, reference: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const t = target.current, r = reference.current;
    if (!t || !r) return;
    const apply = () => {
      t.style.marginLeft = "0px";
      const delta = inkOffset(t) - inkOffset(r);
      const dpr = window.devicePixelRatio || 1;
      t.style.marginLeft = `${-Math.round(delta * dpr) / dpr}px`; // snap to device pixels
    };
    apply();
    document.fonts?.ready.then(apply);
    const ro = new ResizeObserver(apply);
    ro.observe(t); ro.observe(r);
    return () => ro.disconnect();
  }, [target, reference]);
}
