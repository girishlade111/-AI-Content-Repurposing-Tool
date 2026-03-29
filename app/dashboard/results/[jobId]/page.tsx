import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResultsDisplay } from '@/components/dashboard/results-display';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container py-8 mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Results</h1>
            <p className="text-slate-500 mt-1">
              Job created on {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button>New Job</Button>
          </Link>
        </div>

        {job.status === 'failed' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Job Failed</h2>
            <p className="text-red-600">Your credit has been refunded. Please try again.</p>
          </div>
        ) : job.status === 'processing' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">Processing</h2>
            <p className="text-yellow-600">Your job is still being processed. Please refresh the page.</p>
          </div>
        ) : (
          <ResultsDisplay job={job} />
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}