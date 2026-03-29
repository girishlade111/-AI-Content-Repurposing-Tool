import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BulkProcessor } from "@/components/dashboard/bulk-processor";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BulkPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <Header />
      
      <main className="flex-1 container py-12 mx-auto px-4 relative z-10">
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
              <span className="text-white">Bulk Processing</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Bulk Processing</h1>
            <p className="text-slate-400 text-lg">Process multiple content pieces at once</p>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
          </Link>
        </div>

        <div className="animate-fade-in-up animate-delay-100">
          <BulkProcessor />
        </div>
      </main>

      <Footer />
    </div>
  );
}