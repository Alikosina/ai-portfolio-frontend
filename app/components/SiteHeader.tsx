"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, isLanguage, type Language } from "../i18n";
import { useTheme } from "./ThemeProvider";

export default function SiteHeader() {
  const { t, i18n } = useTranslation();
  const { toggleTheme, themeIcon } = useTheme();
  const { user } = useAuth();

  const language: Language = isLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;
  const toggleLanguage = () => {
    const next: Language = language === "en" ? "ru" : "en";
    i18n.changeLanguage(next);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {}
  };

  const initials = user ? (user.name[0] ?? "") + (user.surname[0] ?? "") : "";

  return (
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
        <Link href="/" className="nav-brand" style={{ color: "inherit", textDecoration: "none" }}>
          {t("header.brand")}
        </Link>
        <div style={{ display: "flex", gap: "var(--space-6)", marginRight: "auto" }}>
          <Link href="/">{t("header.nav.home")}</Link>
          <a href="#" onClick={(e) => e.preventDefault()}>
            {t("header.nav.experience")}
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            {t("header.nav.projects")}
          </a>
        </div>
        <button className="btn btn-ghost" onClick={toggleLanguage} title={t("header.switchLanguage")}>
          <i className="ph ph-translate"></i> {language === "en" ? "RU" : "EN"}
        </button>
        <button className="btn btn-icon btn-ghost" onClick={toggleTheme} title={t("header.toggleTheme")}>
          <i className={themeIcon}></i>
        </button>
        {user ? (
          <Link
            href="/profile"
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
            {initials}
          </Link>
        ) : (
          <Link href="/login" className="btn btn-secondary">
            {t("header.login")}
          </Link>
        )}
      </div>
    </nav>
  );
}
