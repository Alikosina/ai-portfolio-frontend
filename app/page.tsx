"use client";

import { useEffect, type CSSProperties } from "react";
import PageShell from "./components/PageShell";
import { APP_VERSION } from "./version";
import { useChatControls } from "./components/ChatContext";

export type Job = {
  dates: string;
  role: string;
  org: string;
  desc: string;
  tags: { label: string; bg: string; fg: string }[];
};

const JOBS: Job[] = [
  {
    dates: "2023 — Now",
    role: "Senior Software Engineer",
    org: "Fieldstone Systems",
    desc: "Led migration of a monolith to Go microservices, cutting p99 latency 40%. Own the platform team's on-call and design reviews.",
    tags: [
      { label: "Go", bg: "var(--color-accent-100)", fg: "var(--color-accent-800)" },
      { label: "Kubernetes", bg: "oklch(0.28 0.06 200)", fg: "oklch(0.85 0.06 200)" },
      { label: "PostgreSQL", bg: "var(--color-neutral-800)", fg: "var(--color-neutral-200)" },
    ],
  },
  {
    dates: "2020 — 2023",
    role: "Software Engineer",
    org: "Harbor Analytics",
    desc: "Built the customer-facing dashboard in React/TypeScript and a real-time ingestion pipeline handling 2M events/day.",
    tags: [
      { label: "React", bg: "var(--color-accent-100)", fg: "var(--color-accent-800)" },
      { label: "TypeScript", bg: "var(--color-neutral-800)", fg: "var(--color-neutral-200)" },
      { label: "Kafka", bg: "oklch(0.30 0.07 40)", fg: "oklch(0.86 0.07 40)" },
    ],
  },
  {
    dates: "2018 — 2020",
    role: "Backend Engineer",
    org: "Loop Payments",
    desc: "Built PCI-compliant payment APIs used by 40+ merchants; wrote the team's first integration test suite.",
    tags: [
      { label: "Node.js", bg: "var(--color-accent-100)", fg: "var(--color-accent-800)" },
      { label: "AWS", bg: "var(--color-neutral-800)", fg: "var(--color-neutral-200)" },
    ],
  },
];


const headingWeight = "var(--font-heading-weight)" as CSSProperties["fontWeight"];


export default function Home() {
  const { openChat } = useChatControls();
  useEffect(() => {
    console.log(`v-${APP_VERSION}`);
  }, []);

  return (
    <PageShell>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 var(--space-8)" }}>
            <section style={{ padding: "88px 0 64px" }}>
              <p
                className="kicker"
                style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 var(--space-4)" }}
              >
                Software Engineer
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: headingWeight,
                  fontSize: 52,
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                  margin: "0 0 var(--space-6)",
                  maxWidth: 780,
                }}
              >
                I build fast, reliable products — and ship them with care.
              </h1>
              <p className="lede" style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 560, margin: "0 0 var(--space-8)" }}>
                Backend-leaning full-stack engineer specializing in distributed systems, developer tooling, and
                pragmatic React front ends. Currently open to senior roles.
              </p>
              <div style={{ display: "flex", gap: "var(--space-4)" }}>
                <button className="btn btn-primary">View experience</button>
                <button className="btn btn-ghost" onClick={openChat}>
                  <i className="ph ph-chat-circle-text"></i> Ask the AI assistant
                </button>
              </div>
            </section>
  
            <div style={{ padding: "0 0 96px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: headingWeight,
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-neutral-400)",
                  margin: "0 0 var(--space-6)",
                }}
              >
                Experience
              </h2>
              <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
                {JOBS.map((job, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr",
                      gap: "var(--space-6)",
                      padding: "var(--space-6) 0",
                      borderTop: "1px solid var(--color-divider)",
                    }}
                  >
                    <div className="tl-dates" style={{ color: "var(--color-neutral-500)", fontSize: 13, paddingTop: 3 }}>
                      {job.dates}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: headingWeight,
                          fontSize: 18,
                          margin: "0 0 4px",
                        }}
                      >
                        {job.role}
                      </h3>
                      <p className="tl-org" style={{ color: "var(--color-accent-300)", fontSize: 14, margin: "0 0 var(--space-3)" }}>
                        {job.org}
                      </p>
                      <p
                        className="tl-desc"
                        style={{ color: "var(--color-neutral-300)", fontSize: 14, lineHeight: 1.6, margin: "0 0 var(--space-3)" }}
                      >
                        {job.desc}
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {job.tags.map((tag, ti) => (
                          <span key={ti} className="tag" style={{ background: tag.bg, color: tag.fg }}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </PageShell>
  );
}
