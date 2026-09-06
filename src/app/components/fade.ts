/** The one scroll-in reveal every home section uses: a 0.5s fade, once, with
 *  an optional stagger. Shared so the four sections stop carrying identical
 *  copies of it. */
export const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
});
