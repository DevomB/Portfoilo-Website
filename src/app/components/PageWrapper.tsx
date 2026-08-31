"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

type Stage = "checking" | "intro" | "ready";

export default function PageWrapper({ children }: { children: ReactNode }) {
  // The splash plays on EVERY load — it is the site's front door, not a
  // one-time onboarding. Any click, key or scroll skips it.
  //
  // It still mounts one effect-flush after hydration rather than in the SSR
  // HTML: the splash's first client render must agree with the server on
  // things the server cannot know (reduced-motion preference, viewport fit),
  // and mounting it client-only sidesteps that whole class of hydration
  // mismatch. The undecided frame renders nothing, which is invisible — both
  // the splash and the page sit on the same black background.
  const [stage, setStage] = useState<Stage>("checking");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage("intro");
  }, []);

  return (
    <>
      <AnimatePresence>
        {stage === "intro" && <LoadingScreen key="loading" onComplete={() => setStage("ready")} />}
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
