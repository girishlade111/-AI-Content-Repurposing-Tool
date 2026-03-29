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
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <Header />
      
      <main className="flex-1 container py-12 mx-auto px-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Welcome back, {session.user?.name}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard/library">
              <Button variant="secondary" size="sm">Library</Button>
            </Link>
            <Link href="/dashboard/bulk">
              <Button variant="secondary" size="sm">Bulk</Button>
            </Link>
            <Link href="/dashboard/social">
              <Button variant="secondary" size="sm">Social</Button>
            </Link>
            <Link href="/dashboard/templates">
              <Button variant="secondary" size="sm">Templates</Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="secondary" size="sm">Analytics</Button>
            </Link>
            <Link href="/dashboard/new">
              <Button size="lg">New Job</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="md:col-span-1 animate-fade-in-up animate-delay-100">
            <CreditsDisplay initialCredits={user?.credits ?? 0} />
          </div>
          <div className="md:col-span-3 animate-fade-in-up animate-delay-200">
            <Card className="p-6">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Quick Stats
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-white/[0.03]">
                  <p className="text-3xl font-bold gradient-text mb-1">{user?.tier || "Free"}</p>
                  <p className="text-sm text-slate-400">Current Tier</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/[0.03]">
                  <p className="text-3xl font-bold text-white mb-1">{jobs.length}</p>
                  <p className="text-sm text-slate-400">Total Jobs</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/[0.03]">
                  <p className="text-3xl font-bold text-green-400 mb-1">
                    {jobs.filter((j) => j.status === "completed").length}
                  </p>
                  <p className="text-sm text-slate-400">Completed</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-fade-in-up animate-delay-300">
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Recent Jobs
            </h2>
            <JobsList initialJobs={jobs} />
          </div>
          
          <div className="animate-fade-in-up animate-delay-400">
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link href="/dashboard/new" className="block group">
                <Card hover className="p-6 transition-default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-amber-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">Create New Job</h3>
                        <p className="text-sm text-slate-400 mt-1">Transform content into multiple assets</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-amber-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Card>
              </Link>
              
              <Link href="/dashboard/templates" className="block group">
                <Card hover className="p-6 transition-default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-purple-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">Manage Templates</h3>
                        <p className="text-sm text-slate-400 mt-1">Save and reuse your AI prompts</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-amber-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Card>
              </Link>
              
              <Link href="/dashboard/analytics" className="block group">
                <Card hover className="p-6 transition-default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-green-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">View Analytics</h3>
                        <p className="text-sm text-slate-400 mt-1">Track your content performance</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-amber-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}