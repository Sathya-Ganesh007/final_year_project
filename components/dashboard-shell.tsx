"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardForm } from "@/components/dashboard-form";
import { RecentCrawlsTable } from "@/components/recent-crawls-table";

export function DashboardShell() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"single" | "full">("single");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);

  async function loadRecent() {
    try {
      setRecentLoading(true);
      const { data, error } = await supabase
        .from("scraped_pages")
        .select("id, url, mode, title, created_at, images, links")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) {
        console.error("Failed to load recent crawls", error);
        return;
      }
      setRecent(data ?? []);
    } finally {
      setRecentLoading(false);
    }
  }

  useEffect(() => {
    loadRecent();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!url) {
      setError("Please enter a URL to crawl.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/crawler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to crawl URL");
        return;
      }

      const analysisId =
        Array.isArray(data?.analysisIds) && data.analysisIds.length > 0
          ? data.analysisIds[0]
          : null;

      setUrl("");
      setSuccess(
        analysisId
          ? "Crawl completed. Redirecting to analysis..."
          : "Crawl completed. View full details in the Analysis tab.",
      );

      await loadRecent();

      if (analysisId) {
        router.push(`/analysis/${analysisId}`);
      }
    } catch (err: any) {
      setError(err?.message || "Unexpected error while crawling");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-8 dark:border-neutral-700 dark:bg-neutral-900">
        <DashboardHeader />

        <DashboardForm
          url={url}
          mode={mode}
          loading={loading}
          error={error}
          success={success}
          onSubmit={handleSubmit}
          onUrlChange={setUrl}
          onModeChange={setMode}
        />

        <RecentCrawlsTable recent={recent} loading={recentLoading} />
      </div>
    </div>
  );
}

