"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth, type AuthCredentials } from "../auth/AuthProvider";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body: AuthCredentials = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    if (isSignup) {
      body.name = String(form.get("name") ?? "");
      body.surname = String(form.get("surname") ?? "");
    }

    setBusy(true);
    setError(null);
    const result = isSignup ? await register(body) : await login(body);
    setBusy(false);

    if (result) {
      setError(result);
      return;
    }
    router.push("/profile");
  }

  return (
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
        {isSignup ? "Create an account" : "Welcome back"}
      </p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", fontSize: 32, margin: "0 0 var(--space-6)" }}>
        {isSignup ? "Sign up" : "Log in to your account"}
      </h1>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        {isSignup && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="field">
              <label htmlFor="name">First name</label>
              <input id="name" className="input" name="name" required maxLength={100} autoComplete="given-name" />
            </div>
            <div className="field">
              <label htmlFor="surname">Last name</label>
              <input id="surname" className="input" name="surname" required maxLength={100} autoComplete="family-name" />
            </div>
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            name="password"
            type="password"
            required
            minLength={isSignup ? 8 : 1}
            maxLength={72}
            placeholder="••••••••"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </div>

        {error && (
          <p role="alert" style={{ fontSize: 13, color: "#e5484d", margin: 0 }}>
            {error}
          </p>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
        </button>

        <p style={{ fontSize: 13, color: "var(--color-neutral-500)", textAlign: "center", margin: 0 }}>
          {isSignup ? "Already have an account? " : "No account? "}
          <a href={isSignup ? "/login" : "/signup"} style={{ color: "var(--color-accent-300)" }}>
            {isSignup ? "Log in" : "Sign up"}
          </a>
        </p>
      </form>
    </div>
  );
}
