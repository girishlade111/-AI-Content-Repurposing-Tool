'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface GeneratedContent {
  id: string;
  type: string;
  platform: string | null;
  content: string;
}

interface ResultsDisplayProps {
  job: {
    id: string;
    inputType: string;
    status: string;
    content: GeneratedContent[];
  };
}

export function ResultsDisplay({ job }: ResultsDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'social' | 'newsletter' | 'script'>('social');

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const socialPosts = job.content.filter(c => c.type === 'social_post');
  const newsletter = job.content.find(c => c.type === 'newsletter');
  const videoScript = job.content.find(c => c.type === 'video_script');

  const platformColors: Record<string, string> = {
    twitter: 'bg-blue-400',
    linkedin: 'bg-blue-600',
    facebook: 'bg-indigo-600',
    instagram: 'bg-pink-500',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Generated Content</h2>
          <p className="text-sm text-slate-500 mt-1">
            Copy any content and use it on your platforms
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'social' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('social')}
            >
              Social Posts ({socialPosts.length})
            </Button>
            <Button
              variant={activeTab === 'newsletter' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('newsletter')}
            >
              Newsletter
            </Button>
            <Button
              variant={activeTab === 'script' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('script')}
            >
              Video Script
            </Button>
          </div>

          {activeTab === 'social' && (
            <div className="grid gap-4 md:grid-cols-2">
              {socialPosts.map((post) => (
                <div key={post.id} className="p-4 bg-slate-50 rounded-lg relative group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${platformColors[post.platform || 'twitter']}`}>
                      {post.platform}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(post.content, post.id)}
                    >
                      {copiedId === post.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'newsletter' && newsletter && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(newsletter.content, newsletter.id)}
              >
                {copiedId === newsletter.id ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <div className="prose max-w-none whitespace-pre-wrap">
                {newsletter.content}
              </div>
            </div>
          )}

          {activeTab === 'script' && videoScript && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(videoScript.content, videoScript.id)}
              >
                {copiedId === videoScript.id ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <div className="prose max-w-none whitespace-pre-wrap">
                {videoScript.content}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}