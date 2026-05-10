export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 section-y">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="prose-readable max-w-3xl">
          <p className="text-fluid-xs font-semibold uppercase tracking-[0.24em] text-muted">
            About
          </p>
          <h2 className="font-heading mt-3 text-fluid-3xl font-semibold tracking-tight text-ink">
            Background, but with intent
          </h2>
          <div className="mt-6 space-y-4 text-fluid-lg leading-relaxed text-muted">
            <p>
              I&apos;m based in Eastvale, California. I design and build platforms
              for Roosevelt Connect, Virtual Medical Missions, and WebWork
              Innovations, balancing fast iteration with production-grade
              stability.
            </p>
            <p>
              Core stack: Next.js, Tailwind, Node, TypeScript, PostgreSQL,
              Flutter, and C++ from the Norco College pathway. Poker-Bot stays as
              my algorithms and simulation playground.
            </p>
          </div>
        </div>
        <div className="card-soft p-6 sm:p-7">
          <p className="text-fluid-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Current emphasis
          </p>
          <ul className="mt-4 space-y-3 text-fluid-sm text-ink">
            <li className="flex items-center justify-between">
              <span>Product delivery</span>
              <span className="chip-soft px-3 py-1 text-fluid-xs">2024–2026</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Data-intensive UX</span>
              <span className="chip-soft px-3 py-1 text-fluid-xs">APIs</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Applied simulation</span>
              <span className="chip-soft px-3 py-1 text-fluid-xs">PokerLab</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
