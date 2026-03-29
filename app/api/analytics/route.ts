import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalJobs,
      completedJobs,
      creditsUsed,
      recentJobs,
      weeklyStats,
      platformBreakdown,
    ] = await Promise.all([
      prisma.repurposingJob.count({ where: { userId } }),
      prisma.repurposingJob.count({ where: { userId, status: "completed" } }),
      prisma.analytics.count({ 
        where: { userId, eventType: "job_completed", createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.repurposingJob.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { content: true },
      }),
      prisma.repurposingJob.groupBy({
        by: ["createdAt"],
        where: { userId, createdAt: { gte: thirtyDaysAgo } },
        _count: true,
      }),
      prisma.generatedContent.groupBy({
        by: ["platform"],
        where: { job: { userId }, platform: { not: null } },
        _count: true,
      }),
    ]);

    const chartData = weeklyStats.map((stat) => ({
      date: stat.createdAt.toISOString().split("T")[0],
      jobs: stat._count,
    }));

    const platformData = platformBreakdown.map((p) => ({
      platform: p.platform || "other",
      count: p._count,
    }));

    return NextResponse.json({
      totalJobs,
      completedJobs,
      creditsUsed: creditsUsed || totalJobs - (await prisma.repurposingJob.count({ 
        where: { userId, status: "pending" } 
      })),
      recentJobs: recentJobs.map((job) => ({
        id: job.id,
        inputType: job.inputType,
        status: job.status,
        createdAt: job.createdAt.toISOString(),
        contentCount: job.content.length,
      })),
      chartData,
      platformData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { eventType, eventData, jobId } = body;

    await prisma.analytics.create({
      data: {
        userId,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
        jobId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}