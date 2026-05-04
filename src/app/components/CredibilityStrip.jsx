export default function CredibilityStrip() {
  const items = [
    {
      title: "Riverside County Programming Competition",
      detail: "1st place · Individual · May 2025",
      frame: "border-accent-purple/35 bg-accent-purple/[0.06]",
    },
    {
      title: "RCOE County Hackathon",
      detail: "2nd place · Apr 2024 · 20+ hrs practice sprint",
      frame: "border-accent-blue/35 bg-accent-blue/[0.06]",
    },
    {
      title: "Community leadership",
      detail:
        "Coordinator of Volunteers · BSA · Feeding America drives via ERHS FBLA",
      frame: "border-accent-purple/35 bg-accent-purple/[0.06]",
    },
  ];

  return (
    <section className="relative py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className={`rounded-xl border px-5 py-4 ${item.frame}`}
          >
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
