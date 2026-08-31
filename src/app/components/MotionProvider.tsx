"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

// The site uses `m.*` instead of `motion.*` everywhere. The `motion` proxy
// statically references all eleven feature classes (drag, layout, pan, …) so
// nothing tree-shakes: ~39 KB gz on the critical path of every route, and
// hydration — hence the splash — waits on it. `domAnimation` is the subset the
// site actually uses (animate/exit/inView/hover/tap/focus): ~14 KB gz.
//
// Passed as a value, not `() => import(...)`, so there is no second chunk and no
// async gate in front of the splash. `strict` makes a stray `motion.*` throw in
// dev instead of silently re-bundling the full proxy and erasing the saving.
//
// PokerLab needs `layout` animations, which live in `domMax`; it wraps its own
// subtree in a nested LazyMotion so that weight only ships on routes that
// render it, never on `/`.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
