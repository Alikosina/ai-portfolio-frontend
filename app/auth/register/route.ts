import { NextResponse } from "next/server";
import { BACKEND_BASE_URL, setAccessToken } from "../session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return NextResponse.json(data, { status: upstream.status });

    await setAccessToken(data.access_token);
    return NextResponse.json({ user: data.user }, { status: 201 });
  } catch {
    return NextResponse.json({ detail: "Upstream request failed" }, { status: 502 });
  }
}
