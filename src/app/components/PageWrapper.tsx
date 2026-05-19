"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("intro_seen") === "1";
  });

  const handleComplete = () => {
    sessionStorage.setItem("intro_seen", "1");
    setLoaded(true);
  };

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen key="loading" onComplete={handleComplete} />}
      </AnimatePresence>
      <AnimatePresence>
        {loaded && (
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
