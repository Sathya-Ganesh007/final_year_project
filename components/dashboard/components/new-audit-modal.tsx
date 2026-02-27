"use client";

import React, { useState } from "react";
import { 
  IconX, 
  IconWorld, 
  IconArrowRight, 
  IconLoader2,
  IconSearch,
  IconLayoutGrid,
  IconExternalLink
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NewAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAudit: (url: string, mode: string) => void;
  isLoading?: boolean;
}

export function NewAuditModal({ isOpen, onClose, onStartAudit, isLoading }: NewAuditModalProps) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("single");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onStartAudit(url, mode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-neutral-900 tracking-tight">New Audit Scan</h3>
                  <p className="text-neutral-400 font-medium">Enter a domain or specific URL to begin analysis.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-2xl bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <IconX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-600 transition-colors">
                      <IconWorld size={24} />
                    </div>
                    <input 
                      type="url"
                      required
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-lg font-bold text-neutral-900 focus:outline-none focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMode("single")}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-[1.5rem] border-2 transition-all gap-3",
                        mode === "single" 
                          ? "bg-blue-50 border-blue-600/20 text-blue-600" 
                          : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-200"
                      )}
                    >
                      <IconSearch size={28} />
                      <div className="text-center">
                        <p className="font-black text-sm uppercase tracking-widest">Single Page</p>
                        <p className="text-[10px] opacity-60 font-bold">Fast analysis</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("multipage")}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-[1.5rem] border-2 transition-all gap-3",
                        mode === "multipage" 
                          ? "bg-blue-50 border-blue-600/20 text-blue-600" 
                          : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-200"
                      )}
                    >
                      <IconLayoutGrid size={28} />
                      <div className="text-center">
                        <p className="font-black text-sm uppercase tracking-widest">Site Crawl</p>
                        <p className="text-[10px] opacity-60 font-bold">Deep analysis</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !url}
                    className="w-full bg-blue-600 text-white rounded-[1.5rem] py-5 text-lg font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <IconLoader2 size={24} className="animate-spin" />
                        <span>Initializing Scanner...</span>
                      </>
                    ) : (
                      <>
                        <span>Launch Audit Engine</span>
                        <IconArrowRight size={24} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em]">
                    Advanced AI-Powered Security & SEO Analysis
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
