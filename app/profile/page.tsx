"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageShell from "../components/PageShell";
import { useAuth } from "../auth/AuthProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  async function onLogout() {
    await logout();
    router.push("/");
  }

  if (loading || !user) {
    return (
      <PageShell>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px var(--space-8) 120px" }}>
          <p style={{ color: "var(--color-neutral-400)" }}>Loading…</p>
        </div>
      </PageShell>
    );
  }

  const initials = (user.name[0] ?? "") + (user.surname[0] ?? "");

  return (
    <PageShell>
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
            {initials}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", fontSize: 26, margin: "0 0 4px" }}>
              {user.name} {user.surname}
            </h1>
            <p style={{ color: "var(--color-neutral-400)", fontSize: 14, margin: 0 }}>{user.email}</p>
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
              fontWeight: "var(--font-heading-weight)",
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-neutral-400)",
              margin: "0 0 var(--space-5)",
            }}
          >
            Profile
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
            <div className="field">
              <label>First name</label>
              <input className="input" value={user.name} readOnly />
            </div>
            <div className="field">
              <label>Last name</label>
              <input className="input" value={user.surname} readOnly />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" value={user.email} readOnly />
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input" value={user.phone ?? ""} readOnly />
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            padding: "var(--space-6)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: "var(--font-heading-weight)",
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
            <button className="btn btn-secondary" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>

        <p style={{ marginTop: "var(--space-6)", fontSize: 13 }}>
          <Link href="/" style={{ color: "var(--color-accent-300)" }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
