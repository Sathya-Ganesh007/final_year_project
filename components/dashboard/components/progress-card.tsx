"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconInfoCircle } from "@tabler/icons-react";

export function ProgressCard() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/crawler?stats=true");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const percentage = stats?.completionRate || 0;
  const totalTasks = stats?.totalCount || 0;
  const recentTasks = stats?.latestTasks || [];

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2rem] h-full min-h-[500px]">
      <CardHeader className="pb-4 pt-6 md:pt-10 px-6 md:px-10">
        <CardTitle className="text-xl md:text-3xl font-black text-neutral-900 tracking-tight">Application Progress & Task</CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-10 pb-6 md:pb-10 space-y-8 md:space-y-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Aggregating Metrics...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 mt-2 md:mt-4">
              <div className="relative h-28 w-28 md:h-32 md:w-32 shrink-0">
                <svg className="h-full w-full -rotate-90">
                  <circle cx="56" cy="56" r="45" className="stroke-neutral-100 fill-none" strokeWidth="10" />
                  <circle
                    cx="56" cy="56" r="45"
                    className="stroke-blue-600 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={(2 * Math.PI * 45) - (percentage / 100) * (2 * Math.PI * 45)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                    <IconInfoCircle size={20} />
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full flex flex-row items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] md:text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] leading-none">Crawl Success Rate</p>
                  <p className="text-3xl md:text-5xl font-black text-neutral-900 leading-none">{percentage}%</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] md:text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] leading-none mb-1">Total Scans</p>
                  <p className="text-4xl md:text-6xl font-black text-neutral-900 leading-none">{totalTasks}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-50/50">
              <div className="flex items-center gap-3 p-6 bg-blue-50/30 rounded-3xl border border-blue-100/30">
                <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <IconInfoCircle size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black text-neutral-900 uppercase tracking-widest leading-none mb-1">Active Optimization</p>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Automatic health checks are running in the background.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
