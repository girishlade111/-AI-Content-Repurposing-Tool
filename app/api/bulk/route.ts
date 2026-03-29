import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateStructuredContent } from "@/lib/openrouter";

const SYSTEM_PROMPTS = {
  summary: `You are a content summarization expert. Create a concise summary of the given content that captures the key points and main ideas.`,
  socialPosts: `You are a social media expert. Generate 10 platform-specific social media posts in JSON format:
[
  {"platform": "twitter", "content": "post content under 280 chars"},
  {"platform": "linkedin", "content": "post content under 3000 chars"},
  ... (3 twitter, 3 linkedin, 2 facebook, 2 instagram)
]`,
  newsletter: `You are an email marketing expert. Create a newsletter summary with hooks, key points, and CTA.`,
  videoScript: `You are a video script writer. Create a 60-90 second video script with timing notes.`,
};

const createBulkJobSchema = z.object({
  name: z.string().min(1),
  items: z.array(z.object({
    inputType: z.string(),
    inputContent: z.string(),
  })),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    if (jobId) {
      const job = await prisma.bulkJob.findFirst({
        where: { id: jobId, userId },
      });

      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      return NextResponse.json({
        job: {
          ...job,
          items: JSON.parse(job.items || "[]"),
          results: JSON.parse(job.results || "[]"),
        },
      });
    }

    const jobs = await prisma.bulkJob.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      jobs: jobs.map((job) => ({
        ...job,
        items: JSON.parse(job.items || "[]"),
        results: JSON.parse(job.results || "[]"),
      })),
    });
  } catch (error) {
    console.error("Get bulk jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch bulk jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, items } = createBulkJobSchema.parse(body);

    if (user.credits < items.length) {
      return NextResponse.json(
        { error: `Insufficient credits. Need ${items.length}, have ${user.credits}` },
        { status: 402 }
      );
    }

    const bulkJob = await prisma.bulkJob.create({
      data: {
        userId,
        name,
        items: JSON.stringify(items),
        totalItems: items.length,
        status: "processing",
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: items.length } },
    });

    processBulkJob(bulkJob.id, items, userId).catch(console.error);

    return NextResponse.json({ job: bulkJob });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Create bulk job error:", error);
    return NextResponse.json({ error: "Failed to create bulk job" }, { status: 500 });
  }
}

async function processBulkJob(bulkJobId: string, items: any[], userId: string) {
  const results: any[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      const { inputType, inputContent } = items[i];

      const job = await prisma.repurposingJob.create({
        data: {
          userId,
          inputType,
          inputContent,
          status: "processing",
        },
      });

      const [summary, socialPosts, newsletter, videoScript] = await Promise.all([
        generateStructuredContent(SYSTEM_PROMPTS.summary, `Summarize: ${inputContent}`),
        generateStructuredContent(SYSTEM_PROMPTS.socialPosts, `Generate posts: ${inputContent}`),
        generateStructuredContent(SYSTEM_PROMPTS.newsletter, `Create newsletter: ${inputContent}`),
        generateStructuredContent(SYSTEM_PROMPTS.videoScript, `Create script: ${inputContent}`),
      ]);

      const socialData = JSON.parse(socialPosts);

      await prisma.generatedContent.createMany({
        data: [
          { jobId: job.id, type: "summary", content: summary },
          { jobId: job.id, type: "newsletter", content: newsletter },
          { jobId: job.id, type: "video_script", content: videoScript },
        ],
      });

      for (const post of socialData) {
        await prisma.generatedContent.create({
          data: {
            jobId: job.id,
            type: "social_post",
            platform: post.platform,
            content: post.content,
          },
        });
      }

      await prisma.repurposingJob.update({
        where: { id: job.id },
        data: { status: "completed", completedAt: new Date() },
      });

      results.push({ index: i, status: "completed", jobId: job.id });

      await prisma.bulkJob.update({
        where: { id: bulkJobId },
        data: {
          progress: Math.round(((i + 1) / items.length) * 100),
          completedItems: i + 1,
          results: JSON.stringify(results),
        },
      });
    } catch (error) {
      console.error(`Bulk job item ${i} failed:`, error);
      results.push({ index: i, status: "failed", error: "Processing failed" });
    }
  }

  await prisma.bulkJob.update({
    where: { id: bulkJobId },
    data: {
      status: "completed",
      completedAt: new Date(),
      results: JSON.stringify(results),
    },
  });
}