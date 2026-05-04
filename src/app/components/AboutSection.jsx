export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 py-16 md:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
          About
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          I optimize for clarity, throughput, and shipped outcomes.
        </h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            I&apos;m a full-stack engineer based in Eastvale, California: Roosevelt
            Connect (Flutter + scalable APIs), Virtual Medical Missions (telemedicine
            data paths at 10k+ reads / 2k+ writes), WebWork Innovations (commissioned
            Next.js sites with PostgreSQL + Vercel), and a stint leading Ascend Labs.
          </p>
          <p>
            Under the hood I reach for Next.js, Tailwind CSS, Node.js, TypeScript,
            PostgreSQL, Flutter, and modern deployment on Vercel — plus serious C++
            coursework (Norco pathway +{" "}
            <span className="text-accent-purple">Poker-Bot</span>{" "}
            testing discipline).
          </p>
        </div>
      </div>
    </section>
  );
}
