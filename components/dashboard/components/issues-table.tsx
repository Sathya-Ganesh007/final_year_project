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
  IconShieldCheck,
  IconShieldX,
  IconAlertTriangle,
  IconPlus,
  IconLoader2,
  IconX,
  IconCircleCheck
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface IssuesTableProps {
  riskScore?: number;
  loading?: boolean;
}

export function IssuesTable({ riskScore = 0, loading = false }: IssuesTableProps) {
  const [selectedRisk, setSelectedRisk] = React.useState<any>(null);

  // Generate risk factors based on actual score if data exists
  const risks = riskScore > 0 ? [
    { 
      name: "SSL/TLS Configuration", 
      score: Math.floor(riskScore * 0.4), 
      status: riskScore > 300 ? "high" : "moderate",
      description: "Analysis of the website's encryption standards and certificate validity.",
      impact: "Critical for user data protection and SEO ranking.",
      recommendation: "Ensure all resources are loaded over HTTPS and use TLS 1.3."
    },
    { 
      name: "Meta Tag Optimization", 
      score: Math.floor(riskScore * 0.2), 
      status: "low",
      description: "Evaluation of title tags, meta descriptions, and Open Graph data.",
      impact: "Affects click-through rates and search engine visibility.",
      recommendation: "Optimize unique titles and descriptions for every page."
    },
    { 
      name: "Content Security Policy", 
      score: Math.floor(riskScore * 0.3), 
      status: riskScore > 400 ? "extreme" : "moderate",
      description: "Check for security headers that prevent Cross-Site Scripting (XSS).",
      impact: "High mitigation against common injection attacks.",
      recommendation: "Implement a strict CSP header and disable unsafe-inline scripts."
    },
    { 
      name: "Image Optimization", 
      score: Math.floor(riskScore * 0.1), 
      status: "low",
      description: "Review of image formats, compression, and sizing across the site.",
      impact: "Improves page load speed and user experience.",
      recommendation: "Convert images to WebP and use responsive image attributes."
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "bg-blue-600";
      case "moderate": return "bg-emerald-500";
      case "high": return "bg-amber-500";
      case "extreme": return "bg-red-500";
      default: return "bg-neutral-400";
    }
  };

  return (
    <>
    <Card className="border-none shadow-sm shadow-blue-500/5 bg-white overflow-hidden rounded-2xl">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg font-bold">Identified Risk Factors</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-neutral-50 border border-neutral-100 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-40 sm:w-64"
              />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 active:scale-95">
              <IconPlus size={14} />
              <span className="hidden sm:inline">Request Risk Mitigation</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-neutral-50 bg-neutral-50/30">
                <th className="py-3 px-8 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Risk Name</th>
                <th className="py-3 px-8 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Risk Score</th>
                <th className="py-3 px-8 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <IconLoader2 className="animate-spin text-blue-600" size={24} />
                       <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Analyzing Risks...</p>
                    </div>
                  </td>
                </tr>
              ) : risks.length === 0 ? (
                <tr>
                   <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <IconShieldCheck className="text-emerald-500" size={32} />
                       <p className="text-sm font-bold text-neutral-900">Zero Risk Factors Detected</p>
                       <p className="text-xs text-neutral-400">Everything looks secure across your audited sites.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                risks.map((risk, idx) => (
                  <tr key={idx} className="border-b border-neutral-50 group hover:bg-neutral-50/20 transition-colors">
                    <td className="py-4 px-8 text-sm font-bold text-neutral-900">{risk.name}</td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", getStatusColor(risk.status))} />
                        <span className="text-sm font-black text-neutral-900">{risk.score}</span>
                      </div>
                    </td>
                    <td className="py-4 px-8 text-center">
                      <button 
                        onClick={() => setSelectedRisk(risk)}
                        className="px-4 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 text-[10px] font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <AnimatePresence>
      {selectedRisk && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRisk(null)}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 md:p-10"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{selectedRisk.name}</h3>
                  <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white", getStatusColor(selectedRisk.status))}>
                    {selectedRisk.status}
                  </div>
                </div>
                <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">Detailed Analysis Report</p>
              </div>
              <button 
                onClick={() => setSelectedRisk(null)}
                className="p-2 rounded-xl bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-neutral-50 rounded-2xl space-y-3">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Condition Summary</p>
                <p className="text-sm font-bold text-neutral-600 leading-relaxed">{selectedRisk.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-100 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Impact Level</p>
                  <p className="text-xs font-bold text-neutral-900">{selectedRisk.impact}</p>
                </div>
                <div className="p-4 border border-neutral-100 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Calculated Score</p>
                  <p className="text-lg font-black text-blue-600">{selectedRisk.score}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Required Action</p>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
                  <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                    <IconCircleCheck size={20} />
                  </div>
                  <p className="text-sm font-bold text-blue-900 leading-snug">{selectedRisk.recommendation}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedRisk(null)}
                className="w-full bg-neutral-900 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-neutral-900/10"
              >
                Acknowledged
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
