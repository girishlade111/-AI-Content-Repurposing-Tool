import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResultsDisplay } from '@/components/dashboard/results-display';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function ResultsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const userId = (session.user as { id: string }).id;

  const job = await prisma.repurposingJob.findFirst({
    where: {
      id: params.jobId,
      userId,
    },
    include: {
      content: true,
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <Header />
      
      <main className="flex-1 container py-12 mx-auto px-4 max-w-5xl relative z-10">
        <div className="flex items-center justify-between mb-10 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Link href="/dashboard" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-white">Results</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Results</h1>
            <p className="text-slate-400 text-lg">
              Job created on {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button>New Job</Button>
          </Link>
        </div>

        {job.status === 'failed' ? (
          <Card className="p-8 text-center animate-fade-in-up animate-delay-100">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Job Failed</h2>
            <p className="text-slate-400">Your credit has been refunded. Please try again.</p>
          </Card>
        ) : job.status === 'processing' ? (
          <Card className="p-8 text-center animate-fade-in-up animate-delay-100">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Processing</h2>
            <p className="text-slate-400">Your job is still being processed. Please refresh the page.</p>
          </Card>
        ) : (
          <div className="animate-fade-in-up animate-delay-100">
            <ResultsDisplay job={job} />
          </div>
        )}

        <div className="mt-8 text-center animate-fade-in-up animate-delay-200">
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}