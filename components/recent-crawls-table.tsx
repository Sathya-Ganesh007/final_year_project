"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RecentCrawlsTableProps {
  recent: any[];
  loading: boolean;
}

export function RecentCrawlsTable({ recent, loading }: RecentCrawlsTableProps) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-base">Recent crawls</CardTitle>
        <CardDescription>Last 10 analyses saved to your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Loading recent crawls...
          </p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            No crawls yet. Submit a URL above to start.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[220px] truncate text-xs">
                    {row.url}
                  </TableCell>
                  <TableCell className="capitalize text-xs">
                    {row.mode}
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate text-xs">
                    {row.title ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {Array.isArray(row.images) ? row.images.length : 0}
                  </TableCell>
                  <TableCell className="text-xs">
                    {Array.isArray(row.links) ? row.links.length : 0}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

