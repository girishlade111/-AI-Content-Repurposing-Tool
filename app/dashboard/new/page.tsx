import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JobForm } from '@/components/dashboard/job-form';
import { Card } from '@/components/ui/card';

export default async function NewJobPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <Header />
      
      <main className="flex-1 container py-12 mx-auto px-4 max-w-3xl relative z-10">
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">New Repurposing Job</h1>
          </div>
          <p className="text-slate-400 mt-2 text-lg">
            Enter your content and let AI transform it into multiple formats
          </p>
        </div>

        <Card className="p-8 animate-fade-in-up animate-delay-100">
          <JobForm />
        </Card>
      </main>

      <Footer />
    </div>
  );
}