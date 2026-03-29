"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, CheckCircle, XCircle, Upload } from "lucide-react";

interface BulkItem {
  inputType: string;
  inputContent: string;
}

interface BulkJob {
  id: string;
  name: string;
  items: BulkItem[];
  status: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  results: { index: number; status: string }[];
  createdAt: string;
}

export function BulkProcessor() {
  const [jobs, setJobs] = useState<BulkJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<BulkItem[]>([{ inputType: "text", inputContent: "" }]);
  const [jobName, setJobName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/bulk");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch bulk jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  function addItem() {
    setItems([...items, { inputType: "text", inputContent: "" }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof BulkItem, value: string) {
    setItems(items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }

  async function submitBulkJob() {
    if (!jobName || items.length === 0) return;

    const validItems = items.filter(item => item.inputContent.trim().length >= 50);
    if (validItems.length === 0) {
      alert("Please add at least one item with 50+ characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: jobName, items: validItems }),
      });

      if (res.ok) {
        const data = await res.json();
        setJobs([data.job, ...jobs]);
        setShowForm(false);
        setJobName("");
        setItems([{ inputType: "text", inputContent: "" }]);
        pollJobStatus(data.job.id);
      }
    } catch (error) {
      console.error("Failed to submit bulk job:", error);
    } finally {
      setSubmitting(false);
    }
  }

  function pollJobStatus(jobId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bulk?jobId=${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(jobs.map(j => j.id === jobId ? data.job : j));
          if (data.job.status === "completed" || data.job.status === "failed") {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Failed to poll job status:", error);
      }
    }, 3000);

    setTimeout(() => clearInterval(interval), 300000);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Bulk Processing</h3>
          <p className="text-sm text-slate-400">Process multiple content pieces at once</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Bulk Job
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-white">Create Bulk Job</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Job Name"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="My bulk processing job"
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Content Items ({items.length})</label>
                <Button variant="secondary" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="glass rounded-xl p-4 relative group">
                  <button
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Input Type</label>
                      <select
                        value={item.inputType}
                        onChange={(e) => updateItem(index, "inputType", e.target.value)}
                        className="w-full px-4 py-2 bg-dark-600 border border-white/10 rounded-xl text-white"
                      >
                        <option value="text">Text Content</option>
                        <option value="youtube">YouTube URL</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                      <Textarea
                        value={item.inputContent}
                        onChange={(e) => updateItem(index, "inputContent", e.target.value)}
                        placeholder="Paste your content here (minimum 50 characters)..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={submitBulkJob} disabled={submitting || !jobName}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Start Bulk Processing ({items.length} items)
                  </>
                )}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {jobs.length === 0 && !showForm ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 mb-4">No bulk jobs yet</p>
            <Button onClick={() => setShowForm(true)}>Create Your First Bulk Job</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-white">{job.name}</h4>
                    <p className="text-sm text-slate-400">
                      {job.totalItems} items · {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    job.status === "completed" ? "bg-green-500/20 text-green-400" :
                    job.status === "failed" ? "bg-red-500/20 text-red-400" :
                    "bg-amber-500/20 text-amber-400"
                  }`}>
                    {job.status}
                  </span>
                </div>

                {job.status === "processing" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-amber-400">{job.progress}%</span>
                    </div>
                    <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {job.completedItems} of {job.totalItems} completed
                    </p>
                  </div>
                )}

                {job.results.length > 0 && (
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-slate-300">
                        {job.results.filter(r => r.status === "completed").length} completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-slate-300">
                        {job.results.filter(r => r.status === "failed").length} failed
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}