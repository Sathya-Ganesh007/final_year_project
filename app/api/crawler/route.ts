// Backend route for crawling a URL and returning JSON, based on crawler.txt

// If you later want to require Supabase auth, you can reintroduce the auth
// block from crawler.txt. For now this route is open and just proxies to
// your scraping service and stores normalized results in Supabase.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

type NormalizedPage = {
  url: string;
  mode: string;
  title: string | null;
  description: string | null;
  html: string | null;
  text_content: string | null;
  images: string[];
  links: string[];
};

function toNormalizedPage(
  raw: any,
  fallbackUrl: string,
  mode: string,
  root?: any,
): NormalizedPage {
  const extracted = root?.extractedData ?? raw?.extractedData;
  const summary = root?.summary ?? raw?.summary;

  const url =
    raw?.url || raw?.pageUrl || raw?.href || raw?.canonicalUrl || fallbackUrl;

  const imagesRaw = [
    ...(Array.isArray(raw?.images) ? raw.images : []),
    ...(Array.isArray(extracted?.images) ? extracted.images : []),
  ];

  const linksRaw = [
    ...(Array.isArray(raw?.links) ? raw.links : []),
    ...(Array.isArray(extracted?.links) ? extracted.links : []),
  ];

  const images = Array.isArray(imagesRaw)
    ? imagesRaw
        .map((img: any) =>
          typeof img === "string"
            ? img
            : img?.src || img?.url || img?.href || null,
        )
        .filter((v: string | null): v is string => !!v)
    : [];

  const links = Array.isArray(linksRaw)
    ? linksRaw
        .map((l: any) =>
          typeof l === "string"
            ? l
            : l?.href || l?.url || l?.src || null,
        )
        .filter((v: string | null): v is string => !!v)
    : [];

  let title: string | null = raw?.title ?? null;
  let description: string | null = raw?.description ?? null;

  const metaTags = Array.isArray(extracted?.metaTags)
    ? extracted.metaTags
    : [];

  if (!title) {
    const titleMeta = metaTags.find((m: any) =>
      ["title", "og:title", "dc.title"].includes(m?.name),
    );
    if (titleMeta?.content) title = titleMeta.content;
  }

  if (!description) {
    const descMeta = metaTags.find((m: any) =>
      ["description", "og:description", "dc.description"].includes(m?.name),
    );
    if (descMeta?.content) description = descMeta.content;
  }

  return {
    url,
    mode,
    title,
    description,
    html: raw?.html ?? null,
    text_content: raw?.textContent ?? raw?.text ?? null,
    images,
    links,
  };
}

async function saveScrapeResult(
  body: any,
  data: any,
): Promise<string[] | null> {
  if (!supabaseAdmin) {
    console.warn(
      "Supabase admin client not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY); skipping DB insert.",
    );
    return null;
  }

  const mode = body.mode || "single";

  let pages: NormalizedPage[] = [];

  if (Array.isArray(data?.pages)) {
    pages = data.pages.map((p: any) =>
      toNormalizedPage(p, p?.url || body.url, mode, data),
    );
  } else {
    pages = [toNormalizedPage(data, body.url, mode, data)];
  }

  const { data: inserted, error } = await supabaseAdmin
    .from("scraped_pages")
    .insert(pages)
    .select("id");
  if (error) {
    console.error("Failed to insert scraped pages into Supabase", error);
    return null;
  }

  return Array.isArray(inserted) ? inserted.map((r: any) => r.id) : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body?.url) {
      return new Response(
        JSON.stringify({
          error: "URL is required",
          code: "MISSING_URL",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Get API configuration from environment variables
    let apiBaseUrl =
      process.env.SCRAPER_API_BASE_URL || "http://localhost:3001";

    // Clean the URL by removing any leading '=' characters
    apiBaseUrl = apiBaseUrl.replace(/^=+/, "");
    const apiKey = process.env.SCRAPER_API_KEY;
    const endpoint = `${apiBaseUrl}/scrap`;

    // If no SCRAPER_API_BASE_URL is configured, short‑circuit with mock data
    if (apiBaseUrl.includes("localhost") && !process.env.SCRAPER_API_BASE_URL) {
      const mockData = {
        url: body.url,
        mode: body.mode || "single",
        status: "mock-success",
        message:
          "SCRAPER_API_BASE_URL is not set, so this is mock data from /api/crawler.",
        pagesCrawled: body.mode === "full" ? 3 : 1,
        example: {
          title: "Example page title",
          description: "Example description for the crawled page.",
        },
      };

      const analysisIds = await saveScrapeResult(body, mockData);

      return new Response(JSON.stringify({ ...mockData, analysisIds }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Validate the endpoint URL
    try {
      new URL(endpoint);
    } catch (urlError) {
      console.error("❌ Invalid endpoint URL:", endpoint, urlError);
      return new Response(
        JSON.stringify({
          error: "Invalid API endpoint configuration",
          details: `Invalid URL: ${endpoint}`,
          code: "INVALID_ENDPOINT",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "WebAudit/1.0",
    };
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    // Prepare request body with fallback values
    const scrapeData = {
      url: body.url,
      mode: body.mode || "single", // "single" or "full"
      maxPages: body.maxPages || (body.mode === "full" ? 100 : 1),
      extractImagesFlag:
        body.extractImagesFlag !== undefined ? body.extractImagesFlag : true,
      extractLinksFlag:
        body.extractLinksFlag !== undefined ? body.extractLinksFlag : true,
      detectTechnologiesFlag:
        body.detectTechnologiesFlag !== undefined
          ? body.detectTechnologiesFlag
          : true,
    };

    // Make the upstream request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 180000); // 3 minute timeout

    try {
      const upstreamResponse = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(scrapeData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!upstreamResponse.ok) {
        const errorText = await upstreamResponse
          .text()
          .catch(() => "Unable to read error response");

        const status = upstreamResponse.status;
        const statusText = upstreamResponse.statusText;

        // Avoid logging megabytes of HTML in dev logs
        const logSnippet =
          errorText.length > 800 ? `${errorText.slice(0, 800)}...` : errorText;
        console.error("❌ Scraping API error response:", logSnippet);

        let details = errorText;
        let errorMessage = `Scraping API error: ${status} - ${statusText}`;
        let code: string | undefined;

        // Special handling for Cloudflare Tunnel errors (HTTP 530)
        if (status === 530 && errorText.includes("Cloudflare Tunnel error")) {
          errorMessage = "Cloudflare Tunnel error from upstream scraper";
          code = "CLOUDFLARE_TUNNEL_ERROR";
          details =
            "Cloudflare could not reach the tunnel for the scraping service. Make sure the tunnel / cloudflared is running for the configured host.";
        }

        return new Response(
          JSON.stringify({
            error: errorMessage,
            details,
            status,
            ...(code ? { code } : {}),
          }),
          {
            status,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      // Parse successful response
      const data = await upstreamResponse.json();

      const analysisIds = await saveScrapeResult(body, data);

      return new Response(JSON.stringify({ ...data, analysisIds }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({
            error: "Request timeout",
            message: "Scraping request timed out after 3 minutes",
          }),
          {
            status: 408,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      // Handle connection refused error specifically
      if (
        fetchError instanceof Error &&
        fetchError.message.includes("ECONNREFUSED")
      ) {
        return new Response(
          JSON.stringify({
            error: "Scraping service unavailable",
            message:
              "The scraping service is not running. Please check if the scraping service is started on the configured endpoint.",
            details: `Endpoint: ${endpoint}`,
            code: "SERVICE_UNAVAILABLE",
            suggestion:
              "Make sure the scraping service is running or configure a different endpoint in your environment variables.",
          }),
          {
            status: 503,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error("❌ Scrape API route error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: (error as Error)?.message || "Unknown error occurred",
        code: "INTERNAL_ERROR",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

