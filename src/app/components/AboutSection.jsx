export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 section-y">
      <div className="prose-readable max-w-3xl">
        <p className="text-fluid-xs font-semibold uppercase tracking-wider text-muted">
          About
        </p>
        <h2 className="font-heading mt-2 text-fluid-3xl font-semibold tracking-tight text-white">
          Background
        </h2>
        <div className="mt-6 space-y-4 text-fluid-lg leading-relaxed text-muted">
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
            <span className="font-medium text-accent-purple">Poker-Bot</span> for
            testing and algorithms practice.
          </p>
        </div>
      </div>
    </section>
  );
}
