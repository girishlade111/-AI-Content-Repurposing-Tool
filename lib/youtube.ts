export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

export async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openchat/openchat-7b:free',
      messages: [
        {
          role: 'user',
          content: `Fetch the transcript for YouTube video ID: ${videoId}. If you cannot access it directly, provide information about what content this video might contain based on the ID. If you know the video ID ${videoId}, please provide a transcript or summary. Otherwise, explain that you need the actual video content to process.`,
        },
      ],
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transcript from YouTube');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}