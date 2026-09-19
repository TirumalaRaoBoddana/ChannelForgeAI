import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { collections } from "@/lib/db";
import { getCurrentUser, guestTokenWithQuery } from "@/lib/auth/session";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const rec = collections.generationRequests().find(r => r.id === params.id);
  if (!rec) return fail("NOT_FOUND", "Job not found.", 404);
  const user = getCurrentUser();
  const guestToken = guestTokenWithQuery(req.nextUrl.searchParams.get("g")) ?? "";
  const owned = user ? rec.userId === user.id : rec.guestToken === guestToken;
  if (!owned) return fail("FORBIDDEN", "You do not have access to this job.", 403);
  return ok({
    id: rec.id, status: rec.status, progress: rec.progress,
    error: rec.status === "failed" ? "Something went wrong while generating your asset. Please try again." : null,
    result: rec.result,
  });
}
