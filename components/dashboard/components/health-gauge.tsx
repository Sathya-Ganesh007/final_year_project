"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function HealthGauge() {
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

  const score = stats?.riskScore || 0;
  const maxScore = 450;
  const percentage = Math.min((score / maxScore) * 100, 100);

  const riskLevels = [
    { label: "Low Risk", range: "0-150", color: "bg-blue-600" },
    { label: "Moderate Risk", range: "151 - 300", color: "bg-emerald-500" },
    { label: "High Risk", range: "301-450", color: "bg-amber-500" },
    { label: "Extreme Risk", range: "301-450", color: "bg-red-500" },
  ];

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2rem] h-full min-h-[500px]">
      <CardHeader className="pb-2 pt-6 md:pt-10 px-4 md:px-10">
        <CardTitle className="text-xl md:text-3xl font-black text-neutral-900 tracking-tight text-center lg:text-left">Quadrant Risk</CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-10 pb-6 md:pb-10 flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Calculating Risk...</p>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-[280px] aspect-[1.8/1] overflow-hidden mt-4 md:mt-8">
              <svg className="w-full h-full " viewBox="0 0 200 110">
                <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#f5f5f5" strokeWidth="14" strokeLinecap="round" />
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="40%" stopColor="#10b981" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path
                  d="M 15 100 A 85 85 0 0 1 185 100"
                  fill="none"
                  stroke="url(#riskGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={Math.PI * 85}
                  strokeDashoffset={(Math.PI * 85) - (percentage / 100) * (Math.PI * 85)}
                  className="transition-all duration-1000 ease-out"
                />
                {(() => {
                  const angle = 180 - (percentage * 1.8);
                  const angleRad = (angle * Math.PI) / 180;
                  const x = 100 + 85 * Math.cos(angleRad);
                  const y = 100 - 85 * Math.sin(angleRad);
                  return (
                    <circle cx={x} cy={y} r="8" fill="white" stroke="#f59e0b" strokeWidth="5" className="shadow-lg transition-all duration-1000 ease-out" />
                  );
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 md:pb-2">
                <span className="text-[10px] md:text-[11px] font-black text-neutral-300 uppercase tracking-[0.2em] leading-none mb-1">Risk Score</span>
                <span className="text-4xl md:text-6xl font-black text-neutral-900 leading-none">{score}</span>
              </div>
            </div>

            <div className="w-full mt-8 md:mt-12 space-y-3 md:space-y-4">
              {riskLevels.map((lvl, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-default gap-2">
                  <div className="flex items-center gap-2 md:gap-4 min-w-0">
                    <div className={cn("h-2.5 w-2.5 rounded-full shadow-inner shrink-0", lvl.color)} />
                    <span className="text-[10px] md:text-xs xl:text-sm font-black text-neutral-500 group-hover:text-neutral-900 transition-colors uppercase tracking-tight md:tracking-widest truncate">{lvl.label}</span>
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-neutral-400 font-mono tracking-tighter shrink-0">{lvl.range}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
