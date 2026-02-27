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
  IconPlus
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function IssuesTable() {
  const risks = [
    { name: "Risk Factor A", score: 152, status: "low" },
    { name: "Risk Factor B", score: 330, status: "high" },
    { name: "Risk Factor C", score: 340, status: "high" },
    { name: "Risk Factor D", score: 460, status: "extreme" },
    { name: "Risk Factor E", score: 200, status: "moderate" },
  ];

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
              {risks.map((risk, idx) => (
                <tr key={idx} className="border-b border-neutral-50 group hover:bg-neutral-50/20 transition-colors">
                  <td className="py-4 px-8 text-sm font-bold text-neutral-900">{risk.name}</td>
                  <td className="py-4 px-8">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", getStatusColor(risk.status))} />
                      <span className="text-sm font-black text-neutral-900">{risk.score}</span>
                    </div>
                  </td>
                  <td className="py-4 px-8 text-center">
                    <button className="px-4 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 text-[10px] font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
