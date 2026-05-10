export default function CredibilityStrip() {
  const items = [
    {
      title: "Riverside County Programming Competition",
      detail: "1st place · Individual · May 2025",
    },
    {
      title: "RCOE County Hackathon",
      detail: "2nd place · Apr 2024 · 20+ hrs practice sprint",
    },
    {
      title: "Community leadership",
      detail:
        "Coordinator of Volunteers · BSA · Feeding America drives via ERHS FBLA",
    },
  ];

  return (
    <section className="section-y pt-0">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="card-soft p-5"
          >
            <h3 className="text-fluid-sm font-semibold text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-fluid-sm leading-relaxed text-muted">
              {item.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
