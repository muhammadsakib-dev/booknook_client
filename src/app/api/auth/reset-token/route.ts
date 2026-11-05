import { NextResponse } from "next/server";
import { demoResetTokens } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.toLowerCase() || "";
  const token = demoResetTokens.get(email);
  return NextResponse.json({ token: token || null });
}
