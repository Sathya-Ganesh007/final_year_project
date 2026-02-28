"use client";

import React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { IssuesTable } from "@/components/dashboard/components/issues-table";
import { IconAlertTriangle, IconShieldCheck, IconBrowser, IconLayout2 } from "@tabler/icons-react";

export default function IssuesPage() {
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

  return (
    <DashboardShell title="Risk & Health Issues" breadcrumb="Issues" subtitle="Critical Priority">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl space-y-2">
            <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <IconAlertTriangle size={20} />
            </div>
            <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Critical Issues</p>
            <p className="text-3xl font-black text-red-900">{loading ? "..." : stats?.criticalCount || 0}</p>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl space-y-2">
            <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <IconAlertTriangle size={20} />
            </div>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Warnings</p>
            <p className="text-3xl font-black text-amber-900">{loading ? "..." : stats?.warningCount || 0}</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-2">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <IconShieldCheck size={20} />
            </div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Security Checked</p>
            <p className="text-3xl font-black text-blue-900">{loading ? "..." : (stats?.securityScore || 0) + "%"}</p>
          </div>
        </div>

        <IssuesTable riskScore={stats?.riskScore || 0} loading={loading} />
      </div>
    </DashboardShell>
  );
}
