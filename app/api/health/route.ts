import { NextResponse } from "next/server";
import { createSuccessResponse } from "@/lib/utils/response";

export async function GET() {
  return NextResponse.json(createSuccessResponse({ status: "ok", service: "ChannelForge AI API" }));
}
