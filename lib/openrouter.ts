const FREE_MODELS = [
  'openchat/openchat-7b:free',
  'mistralai/mistral-7b-instruct:free',
  'openai/gpt-3.5-turbo:free',
  'anthropic/claude-3-haiku:free',
  'google/gemini-pro:free',
];

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function generateWithAI(messages: OpenRouterMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
      'X-Title': 'AI Content Repurposing Tool',
    },
    body: JSON.stringify({
      model: FREE_MODELS[Math.floor(Math.random() * FREE_MODELS.length)],
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from AI');
  }

  return data.choices[0].message.content;
}

export async function generateStructuredContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  return generateWithAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}