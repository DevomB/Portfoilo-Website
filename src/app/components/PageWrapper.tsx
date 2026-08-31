"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

type Stage = "checking" | "intro" | "ready";

export default function PageWrapper({ children }: { children: ReactNode }) {
  // Resolved in an effect rather than the useState initializer: reading
  // sessionStorage during render made the server (which always says "show the
  // intro") disagree with a returning client, and React responds to that
  // hydration mismatch by throwing the whole tree away and re-rendering it from
  // scratch — the single biggest startup cost on revisits. The undecided frame
  // renders nothing, which is invisible: both the splash and the page sit on
  // the same black background.
  const [stage, setStage] = useState<Stage>("checking");

  useEffect(() => {
    // ?intro replays the splash on demand; ?hand=<category> previews a forced
    // deal, which is pointless if the splash is skipped — both bypass the gate.
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.has("intro") || params.has("hand");
    // Guarded: the sessionStorage ACCESSOR itself throws SecurityError in
    // browsers with site data blocked (block-all-cookies, some webviews); with
    // no error boundary above us an uncaught effect error would blank the site.
    let seen: string | null = null;
    try {
      seen = sessionStorage.getItem("intro_seen");
    } catch {
      // storage unavailable — treat as first visit and play the intro
    }
    // Deliberate: the stage must resolve after hydration — reading
    // sessionStorage during render is an SSR mismatch (see comment above).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(!forceIntro && seen === "1" ? "ready" : "intro");
  }, []);

  const handleComplete = () => {
    try {
      sessionStorage.setItem("intro_seen", "1");
    } catch {
      // storage blocked — the intro will replay next visit, which is fine;
      // an unguarded throw here would leave the splash latched shut instead
    }
    setStage("ready");
  };

  return (
    <>
      <AnimatePresence>
        {stage === "intro" && <LoadingScreen key="loading" onComplete={handleComplete} />}
      </AnimatePresence>
      <AnimatePresence>
        {stage === "ready" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.45,
              ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
              delay: 0.1,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
