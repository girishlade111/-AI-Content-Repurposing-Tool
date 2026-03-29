"use client";

import { useState, useEffect } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-white/5">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-white pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-slate-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the content repurposing process work?",
      answer:
        "Simply paste your long-form content (blog post, article, or YouTube URL) into our platform. Our AI analyzes your content and automatically generates 10 platform-optimized social posts, a professional newsletter summary, and a video script. The entire process takes just minutes, and you can edit or export the results instantly.",
    },
    {
      question: "What types of content can I repurpose?",
      answer:
        "You can repurpose any written content including blog posts, articles, essays, newsletters, and more. We also support YouTube URLs - just paste the link and we'll extract the transcript automatically. We're constantly adding support for more content types including PDFs and documents.",
    },
    {
      question: "How are the social media posts optimized?",
      answer:
        "Our AI generates platform-specific posts optimized for each social network's unique requirements. You get 3 Twitter/X posts (280 char limit), 3 LinkedIn posts (professional tone), 2 Facebook posts (engaging format), and 2 Instagram posts (with hashtag strategy). Each post includes relevant hashtags and calls-to-action.",
    },
    {
      question: "Can I customize the tone and style of generated content?",
      answer:
        "Yes! Higher-tier plans allow you to customize the tone, style, and target audience for your generated content. You can choose from professional, casual, humorous, inspirational, or any custom tone that matches your brand voice.",
    },
    {
      question: "What happens if I run out of credits?",
      answer:
        "Credits are used whenever you create a repurposing job. When you run out, you can upgrade to a higher plan for more monthly credits, or purchase additional credits as needed. Your existing generated content remains accessible even if you don't have credits to create new jobs.",
    },
    {
      question: "Is my content stored securely?",
      answer:
        "Absolutely. We take data security seriously. Your content is encrypted at rest and in transit. We never use your content to train our AI models. You can delete your content and account at any time, and we respect all data privacy regulations including GDPR.",
    },
    {
      question: "Can I collaborate with my team?",
      answer:
        "Our Agency plan includes team collaboration features, allowing multiple team members to access and work on repurposing jobs together. You can share generated content, manage permissions, and track team usage all from a single dashboard.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our service within the first 7 days, contact our support team for a full refund. Monthly plans can be cancelled anytime with no questions asked.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about our content repurposing platform
          </p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">Still have questions?</p>
          <a
            href="mailto:support@repurpose.ai"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}