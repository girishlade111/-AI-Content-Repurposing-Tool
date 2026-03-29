"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg-primary)] noise">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:shadow-amber transition-all">
              <span className="text-white font-bold text-2xl">AI</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-slate-400 text-lg">Sign in to continue to Repurpose</p>
        </div>

        <Card className="p-8 animate-fade-in-up animate-delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-8 animate-fade-in-up animate-delay-200">
          <Link href="/" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}