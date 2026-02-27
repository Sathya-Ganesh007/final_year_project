"use client";

import React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RecentCrawls } from "@/components/dashboard/components/recent-crawls";

export default function CrawlsPage() {
  return (
    <DashboardShell title="Crawl Intelligence" breadcrumb="Crawls" subtitle="Live Stream">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <RecentCrawls />
      </div>
    </DashboardShell>
  );
}
