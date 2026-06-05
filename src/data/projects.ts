export type ReadmeSection = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  npmPackage?: string;
  demoSlug?: string;
  liveUrl?: string;
  readmeSections?: ReadmeSection[];
};

export const projects: Project[] = [
  {
    slug: "poker-bot",
    name: "Poker-Bot",
    tagline: "NL Hold'em equity engine in C++20 with Monte Carlo simulation.",
    description:
      "A from-scratch C++20 No-Limit Texas Hold'em engine covering the full dealing pipeline, betting phases, hand evaluation, and parallel Monte Carlo equity simulation. Built as an algorithms and systems playground — the same engine powers the PokerLab demo on this site via the poker-calculations npm package.",
    techStack: ["C++20", "CMake", "GoogleTest", "Node.js", "N-API"],
    githubUrl: "https://github.com/DevomB/Poker-Bot",
    npmPackage: "poker-calculations",
    demoSlug: "poker-lab",
    readmeSections: [
      {
        title: "Architecture",
        body: "The engine is split into independent modules: card representation (bit-packed ranks/suits), dealing (Fisher-Yates shuffle over a 52-card deck), a phase state machine (pre-flop → flop → turn → river → showdown), hand evaluation (two-plus-two lookup table variant), and a parallel Monte Carlo runner that spawns N threads and merges results.",
      },
      {
        title: "How the equity simulation works",
        body: "Given hero hole cards and an optional partial board, the runner deals random villain hands and remaining community cards for a configurable number of iterations. Win/tie/loss counts are accumulated with atomic integers for thread safety, then converted to percentages. The poker-calculations npm package wraps this engine via N-API so it can run inside a Next.js API route.",
      },
      {
        title: "Testing",
        body: "GoogleTest covers the dealing pipeline, hand evaluator edge cases, and equity output distribution. Known-good equity spots (AA vs KK pre-flop ≈ 82%) are used as regression anchors.",
      },
    ],
  },
  {
    slug: "roosevelt-connect",
    name: "Roosevelt Connect",
    tagline: "Platform for resources, messaging, and academics at Eleanor Roosevelt HS.",
    description:
      "A Flutter-based mobile + web platform serving thousands of students at Eleanor Roosevelt High School. Provides school resources, peer messaging, academic tools, and teacher/admin portals — all backed by REST APIs and a PostgreSQL data layer.",
    techStack: ["Flutter", "Dart", "Node.js", "PostgreSQL", "REST APIs", "TypeScript"],
    readmeSections: [
      {
        title: "What it does",
        body: "Roosevelt Connect centralises school life into a single app: announcements, club sign-ups, grade and schedule lookups, and a direct-messaging layer between students and staff. The backend exposes versioned REST endpoints consumed by the Flutter client and a Next.js web companion.",
      },
      {
        title: "Backend design",
        body: "The API layer is a Node/TypeScript service with PostgreSQL. Schema design prioritises read performance for the frequently-queried student roster and schedule tables — heavy use of partial indexes and connection pooling via pg-pool. Auth is JWT-based with refresh token rotation.",
      },
    ],
  },
  {
    slug: "virtual-medical-missions",
    name: "Virtual Medical Missions",
    tagline: "501(c)(3) telemedicine platform — scheduling, records, and live session support.",
    description:
      "VMM deploys volunteer doctors to rural communities (most recently 400+ patients in Kenya) through a telemedicine platform I co-built and currently lead as President / Head of Computer Science. The system handles pre-mission scheduling, live-session patient records with high read/write throughput, and post-mission analytics.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.vmmhealthcare.org/",
    readmeSections: [
      {
        title: "System design under live conditions",
        body: "During a mission, the platform handles concurrent record writes from multiple volunteer stations. PostgreSQL row-level locking and optimistic concurrency patterns keep data consistent without session blocking. The read replica handles analytics queries so they don't contend with live writes.",
      },
      {
        title: "Stack choices",
        body: "Next.js + Vercel for fast iteration and zero-config deploys. PostgreSQL chosen for its ACID guarantees — patient records can't afford eventual consistency. Tailwind keeps the UI fast to build and easy for non-engineer volunteers to read on-screen during consultations.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
