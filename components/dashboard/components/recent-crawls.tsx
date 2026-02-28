"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  IconSearch, 
  IconPlus, 
  IconWorld,
  IconClock,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoaderQuarter
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function RecentCrawls() {
  const [crawls, setCrawls] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/api/crawler");
        const data = await response.json();
        if (Array.isArray(data)) {
          setCrawls(data);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filteredCrawls = crawls.filter(c => 
    c.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card className="border-none shadow-sm shadow-blue-500/5 bg-white overflow-hidden rounded-3xl">
      <CardHeader className="p-4 md:p-8 pb-4 md:pb-6 border-b border-neutral-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl font-black text-neutral-900 text-center sm:text-left">Recent Crawl Activity</CardTitle>
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <div className="relative group flex-1 sm:flex-none">
              <IconSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search scans..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-50/80 border border-neutral-100 rounded-xl md:rounded-2xl py-2 md:py-2.5 pl-9 md:pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all w-full sm:w-48 md:w-80"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 shrink-0">
              <IconPlus size={16} stroke={3} />
              <span className="hidden xs:inline">New Crawl</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
              <IconLoaderQuarter size={24} className="animate-spin" />
              <span className="text-sm font-bold uppercase tracking-widest">Loading Activity...</span>
            </div>
          ) : (
            <table className="w-full min-w-[700px] md:min-w-0 text-left">
              <thead>
                <tr className="border-b border-neutral-50 bg-neutral-50/20">
                  <th className="py-4 md:py-5 px-6 md:px-10 text-[10px] md:text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">URL</th>
                  <th className="py-4 md:py-5 px-6 md:px-10 text-[10px] md:text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Mode</th>
                  <th className="py-4 md:py-5 px-6 md:px-10 text-[10px] md:text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="py-4 md:py-5 px-6 md:px-10 text-right text-[10px] md:text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Last Run</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredCrawls.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest text-xs">
                      No recent scans found
                    </td>
                  </tr>
                ) : (
                  filteredCrawls.map((crawl, idx) => (
                    <tr key={idx} className="group hover:bg-neutral-50/30 transition-all">
                      <td className="py-4 md:py-6 px-6 md:px-10">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={cn(
                            "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110",
                            idx % 3 === 0 ? "bg-blue-600" : idx % 3 === 1 ? "bg-emerald-500" : "bg-indigo-600"
                          )}>
                            <IconWorld size={20} />
                          </div>
                          <span className="text-sm md:text-base font-bold text-neutral-900 truncate max-w-[150px] sm:max-w-[280px]">{crawl.url}</span>
                        </div>
                      </td>
                      <td className="py-4 md:py-6 px-6 md:px-10">
                        <span className="bg-neutral-100/80 text-neutral-500 px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
                          {crawl.mode === "full" ? "Full Site Crawl" : "Single Page Crawl"}
                        </span>
                      </td>
                      <td className="py-4 md:py-6 px-6 md:px-10 text-center">
                        <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-wider border whitespace-nowrap bg-emerald-50 text-emerald-600 border-emerald-100/50">
                          <IconCircleCheckFilled size={14} />
                          Completed
                        </div>
                      </td>
                      <td className="py-4 md:py-6 px-6 md:px-10 text-right">
                        <div className="flex items-center justify-end gap-1.5 md:gap-2 text-neutral-400">
                          <IconClock size={14} />
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight whitespace-nowrap">{formatTime(crawl.created_at)}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
