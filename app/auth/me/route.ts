import { NextResponse } from "next/server";
import { BACKEND_BASE_URL, clearAccessToken, getAccessToken } from "../session";

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });

  try {
    const upstream = await fetch(`${BACKEND_BASE_URL}/auth/me`, {
      headers: { accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (upstream.status === 401) {
      // Token expired or revoked: drop the cookie so the UI shows the logged-out state.
      await clearAccessToken();
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ detail: "Upstream request failed" }, { status: 502 });
  }
}
