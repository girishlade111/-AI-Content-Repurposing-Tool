'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/empty-state';
import { Loader2, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Job {
  id: string;
  inputType: string;
  status: string;
  createdAt: string | Date;
  completedAt: string | Date | null;
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            title="No jobs yet"
            description="Create your first repurposing job to see results here"
            action={
              <Link href="/dashboard/new">
                <Button>Create Your First Job</Button>
              </Link>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} hover className="transition-default">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white capitalize">{job.inputType} Input</h3>
                <p className="text-sm text-slate-500">{formatDate(new Date(job.createdAt))}</p>
              </div>
              <StatusBadge status={job.status as "pending" | "processing" | "completed" | "failed"} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm flex-wrap">
              <Badge variant="info" size="sm">
                {job.content.filter(c => c.type === 'social_post').length} Social Posts
              </Badge>
              <Badge variant="info" size="sm">
                {job.content.filter(c => c.type === 'newsletter').length} Newsletter
              </Badge>
              <Badge variant="info" size="sm">
                {job.content.filter(c => c.type === 'video_script').length} Video Script
              </Badge>
            </div>
            <Link href={`/dashboard/results/${job.id}`} className="inline-block mt-3">
              <Button variant="outline" size="sm">
                View Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}