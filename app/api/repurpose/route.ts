import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { generateStructuredContent } from '@/lib/openrouter';

const SYSTEM_PROMPTS = {
  summary: `You are a content summarization expert. Create a concise summary of the given content that captures the key points and main ideas. Keep it around 500 words.`,
  
  socialPosts: `You are a social media expert. Generate platform-specific social media posts. Return EXACTLY 10 posts in this JSON format:
[
  {"platform": "twitter", "content": "post content under 280 chars"},
  {"platform": "linkedin", "content": "post content under 3000 chars"},
  ... (3 twitter, 3 linkedin, 2 facebook, 2 instagram posts)
]
Make each post engaging, with appropriate hashtags and calls-to-action.`,
  
  newsletter: `You are an email marketing expert. Create a newsletter summary with:
1. A catchy subject line
2. An engaging intro hook
3. 3-5 key points from the content
4. A body section expanding on the main topic
5. A call-to-action
6. A professional sign-off

Format with clear headings.`,
  
  videoScript: `You are a video script writer. Create a short video script (60-90 seconds) that includes:
1. A hook/opening (first 5 seconds)
2. 3-5 main points
3. A call-to-action
4. Suggested visuals/cues in brackets

Format clearly with timing notes.`,
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const jobs = await prisma.repurposingJob.findMany({
      where: { userId },
      include: {
        content: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ jobs, credits: user.credits });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { inputType, inputContent } = body;

    if (!inputContent || inputContent.trim().length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters' },
        { status: 400 }
      );
    }

    const job = await prisma.repurposingJob.create({
      data: {
        userId,
        inputType: inputType || 'text',
        inputContent,
        status: 'processing',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });

    try {
      const [summary, socialPosts, newsletter, videoScript] = await Promise.all([
        generateStructuredContent(SYSTEM_PROMPTS.summary, `Summarize this content:\n\n${inputContent}`),
        generateStructuredContent(SYSTEM_PROMPTS.socialPosts, `Generate 10 social media posts based on this content:\n\n${inputContent}`),
        generateStructuredContent(SYSTEM_PROMPTS.newsletter, `Create a newsletter based on this content:\n\n${inputContent}`),
        generateStructuredContent(SYSTEM_PROMPTS.videoScript, `Create a video script based on this content:\n\n${inputContent}`),
      ]);

      const socialData = JSON.parse(socialPosts);
      
      await prisma.generatedContent.createMany({
        data: [
          { jobId: job.id, type: 'summary', content: summary },
          { jobId: job.id, type: 'newsletter', content: newsletter },
          { jobId: job.id, type: 'video_script', content: videoScript },
        ],
      });

      for (const post of socialData) {
        await prisma.generatedContent.create({
          data: {
            jobId: job.id,
            type: 'social_post',
            platform: post.platform,
            content: post.content,
          },
        });
      }

      await prisma.repurposingJob.update({
        where: { id: job.id },
        data: { 
          status: 'completed',
          completedAt: new Date(),
        },
      });

      const jobWithContent = await prisma.repurposingJob.findUnique({
        where: { id: job.id },
        include: { content: true },
      });

      return NextResponse.json({ job: jobWithContent });
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      await prisma.repurposingJob.update({
        where: { id: job.id },
        data: { status: 'failed' },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 1 } },
      });

      return NextResponse.json(
        { error: 'Failed to generate content. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Repurposing error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}