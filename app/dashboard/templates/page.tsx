import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TemplateManager } from "@/components/dashboard/template-manager";
import Link from "next/link";

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <Header />
      
      <main className="flex-1 container py-8 mx-auto px-4 relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-white">Templates</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <p className="text-slate-400 mt-1">Save and manage your AI prompt templates</p>
        </div>

        <TemplateManager />
      </main>

      <Footer />
    </div>
  );
}