export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 py-16 md:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
          About
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Background
        </h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            I&apos;m based in Eastvale, California. Recent focus: Roosevelt
            Connect (Flutter and APIs for the high school), Virtual Medical
            Missions (telemedicine and data-heavy sessions), WebWork Innovations
            (commissioned Next.js sites with PostgreSQL on Vercel), and Ascend
            Labs before that wrapped up.
          </p>
          <p>
            Stack-wise: Next.js, Tailwind, Node, TypeScript, PostgreSQL, Flutter,
            plus C++ from the Norco College pathway and{" "}
            <span className="text-accent-purple">Poker-Bot</span> for testing and
            algorithms practice.
          </p>
        </div>
      </div>
    </section>
  );
}
