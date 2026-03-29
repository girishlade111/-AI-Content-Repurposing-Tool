"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Copy, Check, FileText, FileCode } from "lucide-react";

interface GeneratedContent {
  id: string;
  type: string;
  platform: string | null;
  content: string;
}

interface ResultsDisplayProps {
  job: {
    id: string;
    inputType: string;
    status: string;
    createdAt: string | Date;
    content: GeneratedContent[];
  };
}

export function ResultsDisplay({ job }: ResultsDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"social" | "newsletter" | "script">("social");
  const [exporting, setExporting] = useState(false);

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = async (format: "pdf" | "docx") => {
    setExporting(true);
    try {
      const res = await fetch(`/api/export?jobId=${job.id}&format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `repurpose-${job.id}.${format === "pdf" ? "html" : "docx"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const socialPosts = job.content.filter((c) => c.type === "social_post");
  const newsletter = job.content.find((c) => c.type === "newsletter");
  const videoScript = job.content.find((c) => c.type === "video_script");

  const platformColors: Record<string, string> = {
    twitter: "bg-blue-400",
    linkedin: "bg-blue-600",
    facebook: "bg-indigo-600",
    instagram: "bg-pink-500",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Generated Content</h2>
              <p className="text-sm text-slate-400 mt-1">
                Job created on {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => handleExport("pdf")}
                disabled={exporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleExport("docx")}
                disabled={exporting}
              >
                <FileCode className="w-4 h-4 mr-2" />
                Export DOCX
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={activeTab === "social" ? "primary" : "outline"}
              onClick={() => setActiveTab("social")}
            >
              Social Posts ({socialPosts.length})
            </Button>
            <Button
              variant={activeTab === "newsletter" ? "primary" : "outline"}
              onClick={() => setActiveTab("newsletter")}
            >
              Newsletter
            </Button>
            <Button
              variant={activeTab === "script" ? "primary" : "outline"}
              onClick={() => setActiveTab("script")}
            >
              Video Script
            </Button>
          </div>

          {activeTab === "social" && (
            <div className="grid gap-4 md:grid-cols-2">
              {socialPosts.map((post) => (
                <div key={post.id} className="p-4 bg-dark-700/50 rounded-xl relative group border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded text-xs text-white font-medium ${platformColors[post.platform || "twitter"]}`}>
                      {post.platform}
                    </span>
                    <button
                      onClick={() => copyToClipboard(post.content, post.id)}
                      className="p-2 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {copiedId === post.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-300">{post.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "newsletter" && newsletter && (
            <div className="relative">
              <button
                onClick={() => copyToClipboard(newsletter.content, newsletter.id)}
                className="absolute top-4 right-4 p-2 glass rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                {copiedId === newsletter.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <div className="prose max-w-none whitespace-pre-wrap text-slate-300">
                {newsletter.content}
              </div>
            </div>
          )}

          {activeTab === "script" && videoScript && (
            <div className="relative">
              <button
                onClick={() => copyToClipboard(videoScript.content, videoScript.id)}
                className="absolute top-4 right-4 p-2 glass rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                {copiedId === videoScript.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <div className="prose max-w-none whitespace-pre-wrap text-slate-300">
                {videoScript.content}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}