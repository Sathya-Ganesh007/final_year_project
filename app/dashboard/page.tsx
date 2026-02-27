"use client";

import React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProgressCard } from "@/components/dashboard/components/progress-card";
import { HealthGauge } from "@/components/dashboard/components/health-gauge";

export default function DashboardPage() {
  return (
    <DashboardShell title="Strategic Overview" breadcrumb="Overview" subtitle="Active Analysis">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8">
            <ProgressCard />
          </div>
          <div className="xl:col-span-4">
            <HealthGauge />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
