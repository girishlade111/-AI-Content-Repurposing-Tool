import { NextRequest, NextResponse } from 'next/server';
import { extractYouTubeVideoId, fetchYouTubeTranscript } from '@/lib/youtube';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const transcript = await fetchYouTubeTranscript(videoId);

    return NextResponse.json({ transcript, videoId });
  } catch (error) {
    console.error('YouTube transcript error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}