import { NextResponse } from "next/server";

const BASE_URL = (process.env.CHAT_API_URL || "http://localhost:3001/llm/generate").replace(/\/llm\/generate$/, "");

export async function POST(request: Request) {
  let draftId: unknown;
  try {
    ({ draft_id: draftId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof draftId !== "string" || !draftId) {
    return NextResponse.json({ error: "`draft_id` is required" }, { status: 400 });
  }
  try {
    const upstream = await fetch(`${BASE_URL}/llm/email/confirm`, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ draft_id: draftId }),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
