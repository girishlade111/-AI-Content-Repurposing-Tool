import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createItemSchema = z.object({
  jobId: z.string().optional(),
  title: z.string().min(1),
  folder: z.string().default("default"),
  tags: z.array(z.string()).default([]),
  contentType: z.string().optional(),
  preview: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");
    const tag = searchParams.get("tag");
    const favorites = searchParams.get("favorites") === "true";

    const items = await prisma.contentLibrary.findMany({
      where: {
        userId,
        ...(folder ? { folder } : {}),
        ...(favorites ? { isFavorite: true } : {}),
      },
      include: {
        job: {
          include: {
            content: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let filteredItems = items;
    if (tag) {
      filteredItems = items.filter((item) => {
        const tags = JSON.parse(item.tags || "[]");
        return tags.includes(tag);
      });
    }

    return NextResponse.json({
      items: filteredItems.map((item) => ({
        id: item.id,
        title: item.title,
        folder: item.folder,
        tags: JSON.parse(item.tags || "[]"),
        isFavorite: item.isFavorite,
        contentType: item.contentType,
        preview: item.preview,
        createdAt: item.createdAt.toISOString(),
        jobId: item.jobId,
        contentCount: item.job?.content.length || 0,
      })),
    });
  } catch (error) {
    console.error("Get library error:", error);
    return NextResponse.json({ error: "Failed to fetch library" }, { status: 500 });
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
    const { jobId, title, folder, tags, contentType, preview } = createItemSchema.parse(body);

    const item = await prisma.contentLibrary.create({
      data: {
        userId,
        jobId,
        title,
        folder,
        tags: JSON.stringify(tags),
        contentType,
        preview,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Create library item error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { id, title, folder, tags, isFavorite } = body;

    const item = await prisma.contentLibrary.findFirst({
      where: { id, userId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updated = await prisma.contentLibrary.update({
      where: { id },
      data: {
        title: title ?? item.title,
        folder: folder ?? item.folder,
        tags: tags ? JSON.stringify(tags) : item.tags,
        isFavorite: isFavorite ?? item.isFavorite,
      },
    });

    return NextResponse.json({
      item: {
        ...updated,
        tags: JSON.parse(updated.tags || "[]"),
      },
    });
  } catch (error) {
    console.error("Update library item error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const item = await prisma.contentLibrary.findFirst({
      where: { id, userId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.contentLibrary.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete library item error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}