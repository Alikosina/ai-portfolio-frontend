import { NextResponse } from "next/server";
import { BACKEND_BASE_URL, getAccessToken } from "@/app/auth/session";

export async function POST(request: Request) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ detail: "Войдите, чтобы подтвердить отправку" }, { status: 401 });
  }

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
    const upstream = await fetch(`${BACKEND_BASE_URL}/llm/email/confirm`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ draft_id: draftId }),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
