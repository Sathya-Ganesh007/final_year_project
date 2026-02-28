"use client";

import React, { useState } from "react";
import { 
  IconSearch, 
  IconWorld,
  IconArrowRight,
  IconLoader2,
  IconLayoutGrid
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface CrawlSearchBarProps {
  onStartAudit: (url: string, mode: string) => void;
  isLoading?: boolean;
}

export function CrawlSearchBar({ onStartAudit, isLoading }: CrawlSearchBarProps) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("single");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onStartAudit(url, mode);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="relative flex flex-col md:flex-row items-center gap-4 bg-white border border-neutral-100 p-3 md:p-4 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-blue-500/5 group focus-within:ring-8 focus-within:ring-blue-500/5 focus-within:border-blue-200 transition-all">
        <div className="flex items-center gap-4 pl-6 flex-1 w-full min-w-0">
          <IconWorld size={28} className="text-blue-500 shrink-0" />
          <input 
            type="url" 
            required
            placeholder="Paste website link to crawl..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent border-none py-3 text-xl font-bold text-neutral-900 focus:outline-none placeholder:text-neutral-300 placeholder:font-medium"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 px-4 md:border-l border-neutral-100 w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              mode === "single" 
                ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100" 
                : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <IconSearch size={18} />
            <span>Single Page</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("full")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              mode === "full" 
                ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100" 
                : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <IconLayoutGrid size={18} />
            <span>Full Site</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full md:w-auto bg-blue-600 text-white p-4 md:p-5 rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center shrink-0"
        >
          {isLoading ? (
            <IconLoader2 size={28} className="animate-spin" />
          ) : (
            <IconArrowRight size={28} stroke={3} />
          )}
        </button>
      </div>
    </form>
  );
}
