"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass py-3 border-b border-white/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:animate-pulse-glow transition-all">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-primary)]"></div>
            </div>
            <span className="text-xl font-bold text-white">Repurpose</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {session ? (
              <>
                <Link href="/dashboard" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/new" className="text-slate-300 hover:text-amber-400 transition-colors">
                  New Job
                </Link>
              </>
            ) : (
              <>
                <Link href="#features" className="text-slate-300 hover:text-amber-400 transition-colors">Features</Link>
                <Link href="#how-it-works" className="text-slate-300 hover:text-amber-400 transition-colors">How It Works</Link>
                <Link href="#pricing" className="text-slate-300 hover:text-amber-400 transition-colors">Pricing</Link>
                <Link href="#faq" className="text-slate-300 hover:text-amber-400 transition-colors">FAQ</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 font-semibold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 glass rounded-xl animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-slate-300 hover:text-amber-400 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-slate-300 hover:text-amber-400 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-slate-300 hover:text-amber-400 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-slate-300 hover:text-amber-400 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                <button
                  onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-slate-300 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5 transition-all"
                >
                  {theme === "dark" ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Light Mode
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Dark Mode
                    </>
                  )}
                </button>
                {session ? (
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 font-semibold"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-center text-slate-300 border border-slate-700 rounded-xl"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-4 py-2 text-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 font-semibold"
                    >
                      Start Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}