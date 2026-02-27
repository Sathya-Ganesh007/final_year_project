"use client";

import React from "react";
import { Sidebar } from "./layout/sidebar";
import { Topbar } from "./layout/topbar";
import { IconLayout2, IconFileCode, IconChevronDown, IconLoader2, IconCircleCheck } from "@tabler/icons-react";
import { NewAuditModal } from "./components/new-audit-modal";
import { AuditResults } from "./components/audit-results";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
}

export function DashboardShell({ 
  children, 
  title = "Audit Analysis", 
  subtitle = "Need Review",
  breadcrumb = "Application"
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = React.useState(false);
  const [isCrawling, setIsCrawling] = React.useState(false);
  const [auditData, setAuditData] = React.useState<any>(null);

  const handleStartAudit = async (url: string, mode: string) => {
    setIsCrawling(true);
    try {
      const response = await fetch("/api/crawler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode }),
      });

      if (!response.ok) {
        throw new Error("Failed to start audit");
      }

      const data = await response.json();
      setAuditData(data);
      setIsAuditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error starting audit. Please check console.");
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="flex bg-[#fafbfc] min-h-screen text-neutral-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            {!auditData && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <IconLayout2 size={12} />
                    <span>Dashboard</span>
                    <span>/</span>
                    <IconFileCode size={12} />
                    <span className="text-neutral-900">{breadcrumb}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                      <span className="text-lg font-bold">{title.substring(0, 2)}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate max-w-[200px] md:max-w-none">{title}</h2>
                    <IconChevronDown size={20} className="text-neutral-400 cursor-pointer hover:text-neutral-900 transition-colors shrink-0" />
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-100/50 whitespace-nowrap">
                      {subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button className="flex-1 md:flex-none px-4 md:px-5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-600 text-xs font-bold hover:bg-neutral-50 transition-all shadow-sm active:scale-95">
                    Export
                  </button>
                  <button 
                    onClick={() => setIsAuditModalOpen(true)}
                    className="flex-1 md:flex-none px-4 md:px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                  >
                    New Audit
                  </button>
                </div>
              </div>
            )}

            {auditData ? (
              <AuditResults data={auditData} onBack={() => setAuditData(null)} />
            ) : (
              children
            )}
          </div>
        </main>
      </div>

      <NewAuditModal 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
        onStartAudit={handleStartAudit}
        isLoading={isCrawling}
      />
    </div>
  );
}
