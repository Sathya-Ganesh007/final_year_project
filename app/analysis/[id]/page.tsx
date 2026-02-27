import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnalysisDetailPage(props: PageProps) {
  const { id } = await props.params;

  const { data, error } = await supabase
    .from("scraped_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error) {
      console.error("Error loading analysis detail", error);
    }
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Analysis not found or an error occurred.
        </p>
      </main>
    );
  }

  const images: string[] = Array.isArray(data.images) ? data.images : [];
  const links: string[] = Array.isArray(data.links) ? data.links : [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="truncate">
              {data.title || "Untitled page"}
            </CardTitle>
            <CardDescription className="truncate">
              {data.url}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                Analysis ID
              </p>
              <p className="break-all text-xs">{data.id}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                Mode
              </p>
              <p className="capitalize">{data.mode}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                Created at
              </p>
              <p>
                {data.created_at
                  ? new Date(data.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Overview metrics
                </CardTitle>
                <CardDescription>
                  High-level summary for this crawl.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total images
                  </p>
                  <p>{images.length}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total links
                  </p>
                  <p>{links.length}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">
                    URL
                  </p>
                  <p className="truncate text-xs">{data.url}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Images</CardTitle>
                <CardDescription>
                  {images.length} image{images.length === 1 ? "" : "s"} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No images were extracted for this page.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {images.map((src, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="break-all text-xs">
                            {src}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Links</CardTitle>
                <CardDescription>
                  {links.length} link{links.length === 1 ? "" : "s"} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No links were extracted for this page.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {links.map((href, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="break-all text-xs">
                            {href}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raw">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Raw JSON</CardTitle>
                <CardDescription>
                  Debug view of the stored analysis row.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="max-h-[480px] overflow-auto rounded-md bg-neutral-950 p-3 text-xs text-neutral-50">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

