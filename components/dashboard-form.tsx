"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardFormProps {
  url: string;
  mode: "single" | "full";
  loading: boolean;
  error: string | null;
  success: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onUrlChange: (value: string) => void;
  onModeChange: (value: "single" | "full") => void;
}

export function DashboardForm({
  url,
  mode,
  loading,
  error,
  success,
  onSubmit,
  onUrlChange,
  onModeChange,
}: DashboardFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New crawl</CardTitle>
        <CardDescription>
          Enter a URL and choose whether to crawl a single page or the full site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-100">
              Website URL
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none ring-0 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
              Crawl mode
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onModeChange("single")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  mode === "single"
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-500 dark:border-neutral-700 dark:text-neutral-200",
                )}
              >
                Single page
              </button>
              <button
                type="button"
                onClick={() => onModeChange("full")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  mode === "full"
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-500 dark:border-neutral-700 dark:text-neutral-200",
                )}
              >
                Full site
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !url}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm",
              loading || !url
                ? "cursor-not-allowed bg-neutral-400 dark:bg-neutral-700"
                : "bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
            )}
          >
            {loading ? "Crawling..." : "Start crawl"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        {success && !error && (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            {success}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

