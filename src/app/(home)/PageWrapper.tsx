"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import Splash from "@/app/(home)/Splash";
import { LoadedContext } from "@/app/(home)/LoadedContext";

type Stage = "checking" | "intro" | "ready";

// Module scope is the exact signal for "was this a real page load": a refresh
// or fresh visit re-evaluates the module (flag resets, splash plays); client-
// side navigation around the site keeps the same JS context (flag survives,
// terms -> home goes straight to the page). No storage involved, so a refresh
// always replays.
let introPlayedThisLoad = false;

export default function PageWrapper({ children }: { children: ReactNode }) {
  // The splash plays on EVERY load — it is the site's front door, not a
  // one-time onboarding. Any click, key or scroll skips it.
  //
  // The page content is mounted from the very first render, underneath.
  // It used to mount at the hand-off, which put the entire page mount — 250+
  // elements, 48 motion components, the hero's canvas measurements, first
  // layout — inside the same synchronous task as the click that skipped the
  // splash: a ~90 ms freeze of the moving ring (~600 ms on a throttled CPU).
  // Pre-mounting moves all of that to hydration, where nothing is on screen,
  // and the hand-off becomes two opacity tweens. It also means the `/` HTML
  // actually contains the page for crawlers and link unfurlers.
  //
  // Content that would otherwise play its entrance unseen (the hero, the
  // server log) waits on LoadedContext instead.
  //
  // The splash itself still mounts one effect-flush after hydration rather
  // than in the SSR HTML: its first client render must agree with the server
  // on things the server cannot know (reduced-motion, viewport fit). Until
  // then a static cover — same black as the splash — sits over the page, in
  // the SSR HTML too, so there is never a flash of content before JS.
  const [stage, setStage] = useState<Stage>("checking");

  useEffect(() => {
    // ?hand= previews always run the splash — they are pointless without it
    const force = new URLSearchParams(window.location.search).has("hand");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(introPlayedThisLoad && !force ? "ready" : "intro");
  }, []);

  const ready = stage === "ready";

  return (
    <LoadedContext.Provider value={ready}>
      {stage === "checking" && (
        <div aria-hidden className="fixed inset-0 z-[200]" style={{ background: "var(--color-bg)" }} />
      )}
      <AnimatePresence>
        {stage === "intro" && (
          <Splash
            key="loading"
            onComplete={() => {
              introPlayedThisLoad = true;
              setStage("ready");
            }}
          />
        )}
      </AnimatePresence>
      {/* inert while hidden: no focus, no pointer, out of the a11y tree.
          Deliberately NOT animated. The splash above is opaque and fades
          itself out, which already reveals this; fading the page in as well
          composited the whole document a second time for no visual gain, and
          the two crossfading translucent layers dipped the brightness in the
          middle of the hand-off. */}
      <div inert={!ready}>{children}</div>
    </LoadedContext.Provider>
  );
}
