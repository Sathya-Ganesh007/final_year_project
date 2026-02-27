import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AnalysisPage() {
  const { data, error } = await supabase
    .from("scraped_pages")
    .select("id, url, mode, title, created_at, images, links")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error loading analyses", error);
  }

  const rows = data ?? [];

  return (
    <main className="flex min-h-screen  bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyses</CardTitle>
            <CardDescription>
              Recent crawl results. Click a row to view full details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No analyses found yet. Run a crawl from the dashboard first.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                    >
                      <TableCell className="max-w-[140px] truncate text-xs">
                        <Link
                          href={`/analysis/${row.id}`}
                          className="text-xs text-blue-600 underline-offset-2 hover:underline"
                        >
                          {row.id}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {row.url}
                      </TableCell>
                      <TableCell className="capitalize">{row.mode}</TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {row.title ?? "—"}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(row.images) ? row.images.length : 0}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(row.links) ? row.links.length : 0}
                      </TableCell>
                      <TableCell>
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
      </div>
    </main>
  );
}

