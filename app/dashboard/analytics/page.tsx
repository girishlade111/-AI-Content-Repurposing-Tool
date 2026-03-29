import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <Header />
      
      <main className="flex-1 container py-8 mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-white">Analytics</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 mt-1">Track your content repurposing performance</p>
          </div>
        </div>

        <AnalyticsDashboard />
      </main>

      <Footer />
    </div>
  );
}