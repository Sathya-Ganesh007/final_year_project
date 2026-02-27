"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DashboardHeader() {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl md:text-2xl">
          Website audit dashboard
        </CardTitle>
        <CardDescription>
          Crawl a website, then review structured results in the Analysis tab.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

