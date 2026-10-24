"use client";

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import ChatWidget from "./components/ChatWidget";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, isLanguage, type Language } from "./i18n";
import { APP_VERSION } from "./version";

type Job = {
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

type View = "home" | "login" | "profile";
type Theme = "dark" | "light";

function stop(e: MouseEvent) {
  e.preventDefault();
}

export default function Portfolio() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [view, setView] = useState<View>("home");
  const [chatOpen, setChatOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log(`v-${APP_VERSION}`);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isLanguage(saved) && saved !== i18n.language) i18n.changeLanguage(saved);
    } catch {}
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const themeIcon = theme === "dark" ? "ph ph-moon" : "ph ph-sun";
  const isHome = view === "home";
  const isLogin = view === "login";
  const isProfile = view === "profile";
  const isLoggedOut = view !== "profile";

  const language: Language = isLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleLanguage = () => {
    const next: Language = language === "en" ? "ru" : "en";
    i18n.changeLanguage(next);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {}
  };
  const goHome = () => setView("home");
  const goLogin = () => setView("login");
  const goProfile = () => setView("profile");
  const openChat = () => setChatOpen(true);
  const closeChat = () => setChatOpen(false);

  const headingWeight = "var(--font-heading-weight)" as CSSProperties["fontWeight"];

  return (
    <div
      data-theme={theme}
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <nav className="nav" style={{ justifyContent: "flex-start", borderBottom: "1px solid var(--color-divider)" }}>
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 var(--space-8)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-8)",
            width: "100%",
          }}
        >
          <div className="nav-brand">{t("header.brand")}</div>
          <div style={{ display: "flex", gap: "var(--space-6)", marginRight: "auto" }}>
            <a
              href="#"
              onClick={(e) => {
                stop(e);
                goHome();
              }}
            >
              {t("header.nav.home")}
            </a>
            <a href="#" onClick={stop}>
              {t("header.nav.experience")}
            </a>
            <a href="#" onClick={stop}>
              {t("header.nav.projects")}
            </a>
          </div>
          <button className="btn btn-ghost" onClick={toggleLanguage} title={t("header.switchLanguage")}>
            <i className="ph ph-translate"></i> {language === "en" ? "RU" : "EN"}
          </button>
          <button className="btn btn-icon btn-ghost" onClick={toggleTheme} title={t("header.toggleTheme")}>
            <i className={themeIcon}></i>
          </button>
          {isLoggedOut && (
            <button className="btn btn-secondary" onClick={goLogin}>
              {t("header.login")}
            </button>
          )}
          <a
            href="#"
            onClick={(e) => {
              stop(e);
              goProfile();
            }}
            title={t("header.account")}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--color-accent-800)",
              color: "var(--color-accent-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 500,
              border: "1px solid var(--color-accent-600)",
            }}
          >
            JD
          </a>
        </div>
      </nav>

      {isHome && (
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
      )}

      {isLogin && (
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "96px var(--space-8) 120px" }}>
          <p
            className="kicker"
            style={{
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 var(--space-4)",
              color: "var(--color-accent-300)",
            }}
          >
            Welcome back
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: headingWeight, fontSize: 32, margin: "0 0 var(--space-6)" }}>
            Log in to your account
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div className="field">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary btn-block" onClick={goHome}>
              Log in
            </button>
            <p style={{ fontSize: 13, color: "var(--color-neutral-500)", textAlign: "center", margin: 0 }}>
              No account?{" "}
              <a href="#" onClick={stop} style={{ color: "var(--color-accent-300)" }}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      )}

      {isProfile && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px var(--space-8) 120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)", marginBottom: "var(--space-8)" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--color-accent-800)",
                color: "var(--color-accent-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 500,
                border: "1px solid var(--color-accent-600)",
              }}
            >
              JD
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: headingWeight, fontSize: 26, margin: "0 0 4px" }}>
                Account settings
              </h1>
              <p style={{ color: "var(--color-neutral-400)", fontSize: 14, margin: 0 }}>
                Manage your sign-in and account details
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              padding: "var(--space-6)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: headingWeight,
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-neutral-400)",
                margin: "0 0 var(--space-5)",
              }}
            >
              Profile
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)", marginBottom: "var(--space-5)" }}>
              <div className="field">
                <label>Display name</label>
                <input className="input" type="text" defaultValue="Jordan Diaz" />
              </div>
              <div className="field">
                <label>Username</label>
                <input className="input" type="text" defaultValue="jordandiaz" />
              </div>
            </div>
            <div className="field" style={{ marginBottom: "var(--space-5)" }}>
              <label>Email address</label>
              <input className="input" type="email" defaultValue="jordan.diaz@gmail.com" />
            </div>
            <button className="btn btn-primary">Save changes</button>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              padding: "var(--space-6)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: headingWeight,
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-neutral-400)",
                margin: "0 0 var(--space-5)",
              }}
            >
              Password
            </h2>
            <div className="field" style={{ marginBottom: "var(--space-5)" }}>
              <label>Current password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)", marginBottom: "var(--space-5)" }}>
              <div className="field">
                <label>New password</label>
                <input className="input" type="password" placeholder="••••••••" />
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <input className="input" type="password" placeholder="••••••••" />
              </div>
            </div>
            <button className="btn btn-primary">Update password</button>
            <p style={{ fontSize: 13, color: "var(--color-neutral-500)", margin: "var(--space-4) 0 0" }}>
              Forgot your current password?{" "}
              <a href="#" onClick={stop} style={{ color: "var(--color-accent-300)" }}>
                Send a reset link
              </a>{" "}
              instead.
            </p>
          </div>

          <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: "var(--space-6)" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: headingWeight,
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-neutral-400)",
                margin: "0 0 var(--space-5)",
              }}
            >
              Danger zone
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 14, color: "var(--color-neutral-300)", margin: 0, maxWidth: "60ch" }}>
                Sign out of your account on this device.
              </p>
              <button className="btn btn-secondary" onClick={goHome}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ borderTop: "1px solid var(--color-divider)", padding: "var(--space-8) 0" }}>
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 var(--space-8)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "var(--color-neutral-500)",
            fontSize: 13,
          }}
        >
          <span>© 2026 Alik Sloyan</span>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <a href="#" onClick={stop}>
              <i className="ph ph-github-logo"></i>
            </a>
            <a href="#" onClick={stop}>
              <i className="ph ph-linkedin-logo"></i>
            </a>
            <a href="#" onClick={stop}>
              <i className="ph ph-envelope-simple"></i>
            </a>
          </div>
        </div>
      </footer>

      <ChatWidget open={chatOpen} onOpen={openChat} onClose={closeChat} />
    </div>
  );
}
