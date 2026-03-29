import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CreditsDisplay } from "@/components/dashboard/credits-display";
import { JobsList } from "@/components/dashboard/jobs-list";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
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
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <Header />
      
      <main className="flex-1 container py-8 mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {session.user?.name}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard/library">
              <Button variant="secondary">Library</Button>
            </Link>
            <Link href="/dashboard/bulk">
              <Button variant="secondary">Bulk</Button>
            </Link>
            <Link href="/dashboard/social">
              <Button variant="secondary">Social</Button>
            </Link>
            <Link href="/dashboard/templates">
              <Button variant="secondary">Templates</Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="secondary">Analytics</Button>
            </Link>
            <Link href="/dashboard/new">
              <Button>New Job</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-1">
            <CreditsDisplay initialCredits={user?.credits ?? 0} />
          </div>
          <div className="md:col-span-3">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold gradient-text">{user?.tier || "Free"}</p>
                  <p className="text-sm text-slate-400">Current Tier</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{jobs.length}</p>
                  <p className="text-sm text-slate-400">Total Jobs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {jobs.filter((j) => j.status === "completed").length}
                  </p>
                  <p className="text-sm text-slate-400">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Recent Jobs</h2>
            <JobsList initialJobs={jobs} />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/dashboard/new" className="block glass rounded-2xl p-6 hover:bg-dark-600/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">Create New Job</h3>
                    <p className="text-sm text-slate-400 mt-1">Transform content into multiple assets</p>
                  </div>
                  <svg className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
              
              <Link href="/dashboard/templates" className="block glass rounded-2xl p-6 hover:bg-dark-600/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">Manage Templates</h3>
                    <p className="text-sm text-slate-400 mt-1">Save and reuse your AI prompts</p>
                  </div>
                  <svg className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
              
              <Link href="/dashboard/analytics" className="block glass rounded-2xl p-6 hover:bg-dark-600/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">View Analytics</h3>
                    <p className="text-sm text-slate-400 mt-1">Track your content performance</p>
                  </div>
                  <svg className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}