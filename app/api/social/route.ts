import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLATFORMS = {
  twitter: {
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    scopes: ["tweet.write", "users.read", "offline.access"],
  },
  linkedin: {
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    scopes: ["w_member_social", "openid", "email"],
  },
  facebook: {
    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    scopes: ["pages_manage_posts", "publish_video"],
  },
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const accounts = await prisma.socialAccount.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        platform: true,
        accountName: true,
        accountId: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Get social accounts error:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
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
    const { platform, accessToken, refreshToken, accountName, accountId } = body;

    if (!platform || !accessToken) {
      return NextResponse.json({ error: "Platform and access token required" }, { status: 400 });
    }

    const existing = await prisma.socialAccount.findFirst({
      where: { userId, platform, accountId },
    });

    if (existing) {
      const updated = await prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          accessToken,
          refreshToken,
          accountName,
          accountId,
        },
      });
      return NextResponse.json({ account: updated });
    }

    const account = await prisma.socialAccount.create({
      data: {
        userId,
        platform,
        accessToken,
        refreshToken,
        accountName,
        accountId,
      },
    });

    return NextResponse.json({ account });
  } catch (error) {
    console.error("Connect social account error:", error);
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
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
      return NextResponse.json({ error: "Account ID required" }, { status: 400 });
    }

    const account = await prisma.socialAccount.findFirst({
      where: { id, userId },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    await prisma.socialAccount.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Disconnect social account error:", error);
    return NextResponse.json({ error: "Failed to disconnect account" }, { status: 500 });
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
    const { id, action, content, scheduledFor } = body;

    if (!id || !action) {
      return NextResponse.json({ error: "Account ID and action required" }, { status: 400 });
    }

    const account = await prisma.socialAccount.findFirst({
      where: { id, userId, isActive: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found or inactive" }, { status: 404 });
    }

    if (action === "post") {
      const result = await publishToSocial(account.platform, account.accessToken, content);
      return NextResponse.json({ success: true, postId: result.id });
    }

    if (action === "schedule") {
      const scheduled = await prisma.scheduledPost.create({
        data: {
          userId,
          accountId: account.id,
          content,
          platform: account.platform,
          scheduledFor: new Date(scheduledFor),
          status: "scheduled",
        },
      });
      return NextResponse.json({ success: true, scheduledPost: scheduled });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Social action error:", error);
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}

async function publishToSocial(platform: string, accessToken: string, content: string): Promise<{ id: string }> {
  switch (platform) {
    case "twitter":
      return await publishToTwitter(accessToken, content);
    case "linkedin":
      return await publishToLinkedIn(accessToken, content);
    case "facebook":
      return await publishToFacebook(accessToken, content);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function publishToTwitter(accessToken: string, content: string): Promise<{ id: string }> {
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: content }),
  });

  if (!response.ok) {
    throw new Error(`Twitter API error: ${response.status}`);
  }

  const data = await response.json();
  return { id: data.data?.id || `twitter-${Date.now()}` };
}

async function publishToLinkedIn(accessToken: string, content: string): Promise<{ id: string }> {
  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: "urn:li:person:_me",
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`LinkedIn API error: ${response.status}`);
  }

  return { id: `linkedin-${Date.now()}` };
}

async function publishToFacebook(accessToken: string, content: string): Promise<{ id: string }> {
  const pageId = accessToken.split(":")[0] || "me";
  const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: content,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Facebook API error: ${response.status}`);
  }

  const data = await response.json();
  return { id: data.id || `facebook-${Date.now()}` };
}