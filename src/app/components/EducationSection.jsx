import Link from "next/link";

const items = [
  {
    school: "UC San Diego Extended Studies",
    detail:
      "Multivariable Calculus & Ordinary Differential Equations · Jun–Dec 2025 · Grade: A / A",
    sub:
      "Summer 2025 (MV Calc) · Fall 2025 (ODE) — transcripts hosted on LinkedIn / outbound PDFs.",
    links: [
      {
        label: "Extended Studies · UC San Diego",
        href: "https://extendedstudies.ucsd.edu/",
      },
    ],
  },
  {
    school: "Norco College · Concurrent enrollment",
    detail:
      "CIS-5 · CIS-17A · CIS-17B · CIS-17C — all A grades · Certificate pathway completed.",
    sub: "Heavy emphasis on data structures and disciplined C++ debugging.",
    links: [],
  },
];

const certs = [
  {
    name: "HackerRank · SQL Intermediate",
    href: "https://www.hackerrank.com/certificates/c0c28b8206b3",
    meta: "Issued May 2024 · Credential C0C28B8206B3",
  },
  {
    name: "HackerRank · SQL Basic",
    href: "https://www.hackerrank.com/certificates/900b33f389dd",
    meta: "Issued May 2024 · Credential 900B33F389DD",
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-28 py-16 md:py-20">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-purple">
          Education & certifications
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Coursework & certificates
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {items.map((item) => (
            <article
              key={item.school}
              className="rounded-xl border border-border bg-surface/70 p-6 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-white">{item.school}</h3>
              <p className="mt-2 text-muted">{item.detail}</p>
              <p className="mt-3 text-sm text-accent-purple/90">{item.sub}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {item.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent-blue hover:text-accent-blue-dim"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface/70 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">Certificates</h3>
          <ul className="mt-4 space-y-5">
            {certs.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent-blue hover:text-accent-blue-dim"
                >
                  {c.name}
                </Link>
                <p className="text-sm text-muted">{c.meta}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted">
            Transcripts and grade PDFs are not in this repo; ask on LinkedIn or email if you need them.
          </p>
        </div>
      </div>
    </section>
  );
}
