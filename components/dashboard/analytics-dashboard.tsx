"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ChartData {
  date: string;
  jobs: number;
}

interface PlatformData {
  platform: string;
  count: number;
}

interface RecentJob {
  id: string;
  inputType: string;
  status: string;
  createdAt: string;
  contentCount: number;
}

interface AnalyticsData {
  totalJobs: number;
  completedJobs: number;
  creditsUsed: number;
  recentJobs: RecentJob[];
  chartData: ChartData[];
  platformData: PlatformData[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-400">Failed to load analytics</p>
        </CardContent>
      </Card>
    );
  }

  const maxChartValue = Math.max(...data.chartData.map((d) => d.jobs), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Total Jobs</p>
            <p className="text-3xl font-bold text-white">{data.totalJobs}</p>
            <p className="text-xs text-green-400 mt-1">
              {data.completedJobs} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Credits Used</p>
            <p className="text-3xl font-bold text-amber-400">{data.creditsUsed}</p>
            <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Posts Generated</p>
            <p className="text-3xl font-bold text-white">
              {data.recentJobs.reduce((sum, j) => sum + j.contentCount, 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Across all jobs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Activity Chart</h3>
            <div className="flex gap-2">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    timeRange === range
                      ? "bg-amber-500 text-dark-900"
                      : "bg-dark-600 text-slate-400 hover:text-white"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end gap-2">
            {data.chartData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                No data available
              </div>
            ) : (
              data.chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t transition-all hover:from-amber-400 hover:to-amber-300"
                    style={{ height: `${(d.jobs / maxChartValue) * 100}%`, minHeight: d.jobs > 0 ? "4px" : "0" }}
                  />
                  <span className="text-xs text-slate-500">{new Date(d.date).getDate()}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-white">Platform Breakdown</h3>
          </CardHeader>
          <CardContent>
            {data.platformData.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No platform data yet</p>
            ) : (
              <div className="space-y-3">
                {data.platformData.map((p) => {
                  const colors: Record<string, string> = {
                    twitter: "bg-blue-400",
                    linkedin: "bg-blue-600",
                    facebook: "bg-indigo-600",
                    instagram: "bg-pink-500",
                  };
                  return (
                    <div key={p.platform} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors[p.platform] || "bg-slate-400"}`} />
                      <span className="flex-1 text-slate-300 capitalize">{p.platform}</span>
                      <span className="text-white font-medium">{p.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-white">Recent Jobs</h3>
          </CardHeader>
          <CardContent>
            {data.recentJobs.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No recent jobs</p>
            ) : (
              <div className="space-y-3">
                {data.recentJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-white text-sm capitalize">{job.inputType} Input</p>
                      <p className="text-xs text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      job.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}