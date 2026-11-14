import { cookies } from "next/headers";

export const AUTH_COOKIE = "access_token";

// Base URL of the backend (same origin as CHAT_API_URL without the /llm/generate suffix).
export const BACKEND_BASE_URL = (process.env.CHAT_API_URL || "http://localhost:3001/llm/generate").replace(
  /\/llm\/generate$/,
  "",
);

const MAX_AGE_SECONDS = 60 * 60 * 24;

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value;
}

export async function setAccessToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAccessToken(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}
