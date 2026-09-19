import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/firebase/server";
import { ProjectService } from "@/services/project.service";

export async function GET(req: NextRequest) {
  try {
    const verifiedUser = await verifyAuthHeader(req);
    const projects = await ProjectService.getUserProjects(verifiedUser?.uid);
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const verifiedUser = await verifyAuthHeader(req);
    const body = await req.json();

    if (!body.title || !body.targetNiche) {
      return NextResponse.json({ error: "Missing required fields (title, targetNiche)" }, { status: 400 });
    }

    // Secure server ownership: use verified Firebase UID if logged in
    const userId = verifiedUser?.uid || null;

    const project = await ProjectService.createChannelProject({
      userId: userId || undefined,
      title: body.title,
      targetNiche: body.targetNiche,
      description: body.description,
      profile: body.profile || {
        primaryNiche: body.targetNiche,
        subNiches: body.subNiches || [],
        targetAudience: body.targetAudience || "YouTube viewers seeking high value content",
        valueProposition: body.valueProposition || "Consistent, high-retention video content",
        toneOfVoice: body.toneOfVoice || "Engaging and authoritative",
        contentPillars: body.contentPillars || ["Core Guides", "Tutorials", "Deep Dives"],
      },
      brandKit: body.brandKit || {
        primaryColor: body.primaryColor || "#4F46E5",
        secondaryColor: body.secondaryColor || "#06B6D4",
        accentColor: body.accentColor || "#F59E0B",
        backgroundColor: body.backgroundColor || "#0B0F17",
        headlineFont: body.headlineFont || "Plus Jakarta Sans",
        bodyFont: body.bodyFont || "Inter",
        visualStyle: body.visualStyle || "Modern Vector",
        tagline: body.tagline || "Creator Channel",
      },
      channelNames: body.channelNames || [
        {
          name: body.title,
          handle: body.handle || `@${body.title.replace(/[^a-zA-Z0-9]/g, "")}`,
          isPrimary: true,
        },
      ],
      keywords: body.keywords || [],
      contentIdeas: body.contentIdeas || [],
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
