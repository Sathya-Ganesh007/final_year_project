"use client";

import React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  IconCode, 
  IconClipboard,
  IconCheck,
  IconLoader2,
  IconDatabase,
  IconSearch
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function AdvancedDataPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/crawler");
        const json = await response.json();
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Failed to fetch advanced data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCopy = (json: any, index: number) => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredData = data.filter(item => 
    item.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell 
      title="Advanced Data Inspector" 
      breadcrumb="Advanced" 
      subtitle="Raw Audit Payloads"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Card className="border-none shadow-sm shadow-blue-500/5 bg-white overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 md:p-10 border-b border-neutral-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <IconDatabase size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-neutral-900">System JSON Logs</CardTitle>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Deep-level analysis data for developers</p>
                </div>
              </div>
              <div className="relative group max-w-md w-full md:w-80">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Filter by URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all focus:bg-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 md:p-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <IconLoader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Accessing Data Vault...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-32 space-y-4">
                <IconCode size={48} className="mx-auto text-neutral-200" />
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">No raw data payloads found</p>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredData.map((item, idx) => (
                  <div key={idx} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">ENTRY #{idx + 1}</span>
                        <h4 className="text-sm font-black text-neutral-900 truncate max-w-[200px] md:max-w-md">{item.url}</h4>
                      </div>
                      <button 
                        onClick={() => handleCopy(item, idx)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          copiedIndex === idx 
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-neutral-900 text-white hover:bg-black shadow-lg"
                        )}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <IconCheck size={14} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <IconClipboard size={14} />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-neutral-900 rounded-[1.5rem] p-8 overflow-hidden relative border border-neutral-800 shadow-2xl">
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <pre className="text-[11px] font-mono text-blue-400/90 leading-relaxed">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                      <div className="absolute top-0 right-0 p-4">
                        <div className="flex items-center gap-2 bg-neutral-800/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[9px] font-black text-neutral-400 uppercase">Static JSON Node</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
