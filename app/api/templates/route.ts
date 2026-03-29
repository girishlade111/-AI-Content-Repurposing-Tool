import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.string().default("custom"),
  systemPrompt: z.string().min(1),
  tone: z.string().default("professional"),
  isDefault: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const templates = await prisma.template.findMany({
      where: {
        userId,
        ...(category ? { category } : {}),
      },
      orderBy: [
        { isDefault: "desc" },
        { useCount: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
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
    const { name, description, category, systemPrompt, tone, isDefault } = createTemplateSchema.parse(body);

    if (isDefault) {
      await prisma.template.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await prisma.template.create({
      data: {
        userId,
        name,
        description,
        category,
        systemPrompt,
        tone,
        isDefault,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Create template error:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
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
    const { id, name, description, category, systemPrompt, tone, isDefault } = body;

    const template = await prisma.template.findFirst({
      where: { id, userId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (isDefault && !template.isDefault) {
      await prisma.template.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.template.update({
      where: { id },
      data: {
        name: name ?? template.name,
        description: description ?? template.description,
        category: category ?? template.category,
        systemPrompt: systemPrompt ?? template.systemPrompt,
        tone: tone ?? template.tone,
        isDefault: isDefault ?? template.isDefault,
      },
    });

    return NextResponse.json({ template: updated });
  } catch (error) {
    console.error("Update template error:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
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
    const templateId = searchParams.get("id");

    if (!templateId) {
      return NextResponse.json({ error: "Template ID required" }, { status: 400 });
    }

    const template = await prisma.template.findFirst({
      where: { id: templateId, userId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await prisma.template.delete({ where: { id: templateId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete template error:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}