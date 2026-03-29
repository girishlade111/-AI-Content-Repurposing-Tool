import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JobForm } from '@/components/dashboard/job-form';

export default async function NewJobPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container py-8 mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Repurposing Job</h1>
          <p className="text-slate-500 mt-1">
            Enter your content and let AI transform it into multiple formats
          </p>
        </div>

        <JobForm />
      </main>

      <Footer />
    </div>
  );
}