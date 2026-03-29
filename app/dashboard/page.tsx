import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CreditsDisplay } from '@/components/dashboard/credits-display';
import { JobsList } from '@/components/dashboard/jobs-list';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const userId = (session.user as { id: string }).id;
  
  const [user, jobs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, tier: true },
    }),
    prisma.repurposingJob.findMany({
      where: { userId },
      include: { content: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container py-8 mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, {session.user?.name}</p>
          </div>
          <Link href="/dashboard/new">
            <Button>New Repurposing Job</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-1">
            <CreditsDisplay initialCredits={user?.credits ?? 0} />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary-600">{user?.tier || 'Free'}</p>
                  <p className="text-sm text-slate-500">Current Tier</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600">{jobs.length}</p>
                  <p className="text-sm text-slate-500">Total Jobs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {jobs.filter(j => j.status === 'completed').length}
                  </p>
                  <p className="text-sm text-slate-500">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
          <JobsList initialJobs={jobs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}