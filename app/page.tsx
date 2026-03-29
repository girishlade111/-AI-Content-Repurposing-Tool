import Link from "next/link";
import { FAQSection } from "@/components/sections/faq";

const stats = [
  { value: "50K+", label: "Content Pieces Repurposed" },
  { value: "500K+", label: "Social Posts Generated" },
  { value: "10K+", label: "Happy Users" },
  { value: "4.9/5", label: "User Rating" },
];

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0h4a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h4m10 0H7m0 0v12m10-12v12" />
      </svg>
    ),
    title: "10 Platform-Optimized Posts",
    description: "Get 3 Twitter/X, 3 LinkedIn, 2 Facebook, and 2 Instagram posts. Each optimized for maximum engagement with platform-specific formatting, hashtags, and calls-to-action.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Professional Newsletter",
    description: "Receive a polished newsletter summary with engaging hook, 3-5 key points, body content, and compelling call-to-action. Ready to copy and send to your subscribers.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Video Script in Minutes",
    description: "Get a ready-to-film 60-90 second video script with opening hook, main points, visual cues, and CTA. Perfect for YouTube Shorts, TikTok, or Instagram Reels.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Lightning Fast AI",
    description: "Our advanced AI processes your content in under 2 minutes. No waiting, no queuing. Just paste your content and get professional results instantly.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "YouTube Integration",
    description: "Simply paste a YouTube URL and our AI automatically extracts the transcript. Perfect for repurposing video content into multiple formats for your audience.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Credit-Based System",
    description: "Flexible credit system lets you repurpose as much or as little content as you need. Upgrade anytime for more credits. Your credits roll over monthly.",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste Your Content",
    description: "Enter your blog post, article, or paste a YouTube URL. Our system accepts text up to 10,000 words.",
  },
  {
    number: "02",
    title: "AI Processing",
    description: "Our advanced AI analyzes your content, identifies key themes, and generates platform-optimized outputs.",
  },
  {
    number: "03",
    title: "Export & Publish",
    description: "Copy your generated content with one click. Use it across all your platforms instantly.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Marketing Manager",
    company: "TechFlow Inc.",
    content:
      "This tool has revolutionized our content strategy. We used to spend hours repurposing one blog post. Now it takes minutes, and the quality is consistently excellent.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "YouTube Creator",
    company: "1.2M Subscribers",
    content:
      "I take my long-form videos and turn them into a week&apos;s worth of social content. The video scripts are particularly good - my shorts views have tripled.",
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "CEO & Founder",
    company: "GrowthLab Agency",
    content:
      "The team plan makes so much sense for our agency. We manage content for 15+ clients and Repurpose has cut our production time by 70%. Game changer.",
    avatar: "ER",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out the platform",
    credits: 3,
    features: [
      "3 credits per month",
      "10 social posts",
      "Newsletter generation",
      "Video script creation",
      "YouTube URL support",
      "Basic tone options",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "Great for individual content creators",
    credits: 30,
    features: [
      "30 credits per month",
      "Everything in Free",
      "Priority processing",
      "Advanced tone options",
      "Export to PDF",
      "Email support",
    ],
    cta: "Start Trial",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$79",
    period: "per month",
    description: "For serious marketers and small teams",
    credits: 100,
    features: [
      "100 credits per month",
      "Everything in Starter",
      "Custom tone training",
      "Bulk processing",
      "API access",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Start Trial",
    highlight: false,
  },
  {
    name: "Agency",
    price: "$199",
    period: "per month",
    description: "For agencies managing multiple clients",
    credits: 500,
    features: [
      "500 credits per month",
      "Everything in Pro",
      "White-label option",
      "Client management",
      "Unlimited team members",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-900 noise">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-50" />

      <main>
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[128px]" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">Now supporting 100+ AI models via OpenRouter</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Transform One Content Into</span>
                <br />
                <span className="gradient-text">12+ Engaging Assets</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Paste your blog post, article, or YouTube URL. Our AI automatically generates 10 social media posts, 
                a professional newsletter, and a video script. Save hours of work, amplify your reach.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 font-semibold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center gap-2"
                >
                  Start Free - No Credit Card
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-xl border border-white/10 text-white font-medium text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </a>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free 3 credits
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </span>
              </div>
            </div>

            <div className="mt-20 glass rounded-2xl p-2 max-w-4xl mx-auto animate-fade-in-up animate-delay-200">
              <div className="relative rounded-xl overflow-hidden bg-dark-800">
                <div className="absolute top-0 left-0 right-0 h-8 bg-dark-700 flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="pt-8 p-6 md:p-8 font-mono text-sm">
                  <div className="text-slate-500 mb-4">// Input your content</div>
                  <div className="bg-dark-700/50 rounded-lg p-4 mb-4 border border-white/5">
                    <p className="text-green-400">Paste YouTube URL or your blog content here...</p>
                    <p className="text-slate-500 mt-2">https://youtube.com/watch?v=...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-400">AI Processing... 85%</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2 text-xs text-blue-400">Twitter: 3 posts</div>
                    <div className="bg-blue-600/20 border border-blue-600/30 rounded p-2 text-xs text-blue-400">LinkedIn: 3 posts</div>
                    <div className="bg-indigo-500/20 border border-indigo-500/30 rounded p-2 text-xs text-indigo-400">FB: 2 posts</div>
                    <div className="bg-pink-500/20 border border-pink-500/30 rounded p-2 text-xs text-pink-400">IG: 2 posts</div>
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded p-2 text-xs text-amber-400">Newsletter</div>
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded p-2 text-xs text-purple-400">Video Script</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        <section className="py-20 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Features
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Everything You Need to Repurpose Content
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Powerful AI-driven features that transform your long-form content into engaging multi-platform assets in minutes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group p-6 glass rounded-2xl hover:bg-dark-600/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 px-4 bg-dark-800/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                How It Works
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Repurpose Content in 3 Simple Steps
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                From idea to published content in under 2 minutes. No technical skills required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="glass rounded-2xl p-8 h-full">
                    <div className="text-6xl font-bold text-amber-500/20 mb-4">{step.number}</div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <svg className="w-8 h-8 text-amber-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="glass rounded-2xl p-8 md:p-12 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
                Demo
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                See Repurpose in Action
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Watch how easy it is to transform a single blog post into a week&apos;s worth of engaging content across all platforms.
              </p>
              <div className="relative aspect-video bg-dark-800 rounded-xl overflow-hidden mb-8 border border-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-dark-900 hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
              </div>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                Try It Yourself - It&apos;s Free
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-dark-800/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Loved by Content Creators Worldwide
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Join thousands of marketers and creators who&apos;ve transformed their content strategy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="glass rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed&quot;>{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Pricing
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Choose the plan that fits your needs. All plans include core features. Upgrade anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTiers.map((tier, i) => (
                <div
                  key={i}
                  className={`relative glass rounded-2xl p-6 ${
                    tier.highlight ? "border-2 border-amber-500 glow-amber" : ""
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-dark-900 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{tier.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-slate-400">/{tier.period}</span>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
                    {tier.credits} credits/month
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/register"
                    className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                      tier.highlight
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 hover:from-amber-400 hover:to-amber-500"
                        : "border border-white/10 text-white hover:bg-white/5"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-400 mb-4">
                Need a custom plan for your organization?
              </p>
              <a
                href="mailto:enterprise@repurpose.ai"
                className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact us for enterprise pricing
              </a>
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="relative glass rounded-2xl p-8 md:p-16 text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-[64px]" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-600/20 rounded-full blur-[64px]" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Content?
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Join 10,000+ content creators who save hours every week with Repurpose. Start free today - no credit card required.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 font-semibold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30"
                >
                  Get Started Free
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FAQSection />
      </main>
    </div>
  );
}