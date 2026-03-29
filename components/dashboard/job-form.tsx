'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type InputType = 'text' | 'youtube';

export function JobForm() {
  const router = useRouter();
  const [inputType, setInputType] = useState<InputType>('text');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTranscript, setFetchingTranscript] = useState(false);
  const [error, setError] = useState('');

  const handleFetchTranscript = async () => {
    if (!youtubeUrl) return;
    
    setFetchingTranscript(true);
    setError('');
    
    try {
      const res = await fetch(`/api/youtube/transcript?url=${encodeURIComponent(youtubeUrl)}`);
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setTextContent(data.transcript);
      setInputType('text');
    } catch (err) {
      setError('Failed to fetch transcript. Please try again.');
    } finally {
      setFetchingTranscript(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const content = inputType === 'youtube' ? textContent : textContent;

    if (content.trim().length < 50) {
      setError('Content must be at least 50 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputType,
          inputContent: content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError('Insufficient credits. Please upgrade your plan.');
        } else {
          setError(data.error || 'Something went wrong');
        }
        return;
      }

      router.push(`/dashboard/results/${data.job.id}`);
    } catch (err) {
      setError('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Repurposing Job</h2>
          <p className="text-sm text-slate-500 mt-1">
            Input your content and let AI transform it into multiple formats
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={inputType === 'text' ? 'primary' : 'outline'}
              onClick={() => setInputType('text')}
            >
              Paste Text
            </Button>
            <Button
              type="button"
              variant={inputType === 'youtube' ? 'primary' : 'outline'}
              onClick={() => setInputType('youtube')}
            >
              YouTube URL
            </Button>
          </div>

          {inputType === 'youtube' && (
            <div className="space-y-2">
              <Input
                label="YouTube URL"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleFetchTranscript}
                disabled={!youtubeUrl || fetchingTranscript}
              >
                {fetchingTranscript ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Fetch Transcript'
                )}
              </Button>
            </div>
          )}

          <Textarea
            label="Content"
            placeholder={inputType === 'youtube' 
              ? "Transcript will appear here..." 
              : "Paste your blog post, article, or any long-form content here..."
            }
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={12}
            required
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-slate-500">
              This will use 1 credit and generate: 10 social posts, 1 newsletter, 1 video script
            </p>
            <Button type="submit" disabled={loading || textContent.trim().length < 50}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Start Repurposing'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}