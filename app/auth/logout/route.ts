import { NextResponse } from "next/server";
import { clearAccessToken } from "../session";

export async function POST() {
  await clearAccessToken();
  return NextResponse.json({ status: "logged_out" });
}
