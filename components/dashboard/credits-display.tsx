'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface CreditsDisplayProps {
  initialCredits?: number;
}

export function CreditsDisplay({ initialCredits }: CreditsDisplayProps) {
  const [credits, setCredits] = useState(initialCredits ?? 0);
  const [loading, setLoading] = useState(!initialCredits);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch('/api/credits');
        if (res.ok) {
          const data = await res.json();
          setCredits(data.credits);
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!initialCredits) {
      fetchCredits();
    }
  }, [initialCredits]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-4">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          <span className="text-slate-500">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Available Credits</span>
          <span className="text-2xl font-bold text-primary-600">{credits}</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">1 credit = 1 repurposing job</p>
      </CardContent>
    </Card>
  );
}