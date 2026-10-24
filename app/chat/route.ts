import { NextResponse } from "next/server";

const UPSTREAM_URL = process.env.CHAT_API_URL || "https://asloyanportal.ru/api/llm/generate";

export async function POST(request: Request) {
  let text: unknown;
  let history: unknown;
  try {
    ({ text, history } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "`text` is required" }, { status: 400 });
  }

  if (history !== undefined && !Array.isArray(history)) {
    return NextResponse.json({ error: "`history` must be an array" }, { status: 400 });
  }

  try {
    const upstream = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ text, history: history ?? [] }),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
