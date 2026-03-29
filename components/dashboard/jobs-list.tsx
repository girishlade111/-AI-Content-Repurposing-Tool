'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Job {
  id: string;
  inputType: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  content: Array<{
    id: string;
    type: string;
    platform: string | null;
    content: string;
  }>;
}

interface JobsListProps {
  initialJobs?: Job[];
}

export function JobsList({ initialJobs }: JobsListProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs ?? []);
  const [loading, setLoading] = useState(!initialJobs);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/repurpose');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!initialJobs) {
      fetchJobs();
    }
  }, [initialJobs]);

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-500 mb-4">No repurposing jobs yet</p>
          <Link href="/dashboard/new">
            <Button>Create Your First Job</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium capitalize">{job.inputType} Input</h3>
                <p className="text-sm text-slate-500">{formatDate(new Date(job.createdAt))}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                job.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : job.status === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {job.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex gap-2 text-sm">
                <span className="px-2 py-1 bg-slate-100 rounded">
                  {job.content.filter(c => c.type === 'social_post').length} Social Posts
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded">
                  {job.content.filter(c => c.type === 'newsletter').length} Newsletter
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded">
                  {job.content.filter(c => c.type === 'video_script').length} Video Script
                </span>
              </div>
              <Link href={`/dashboard/results/${job.id}`}>
                <Button variant="outline" size="sm" className="mt-2">
                  View Results
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}