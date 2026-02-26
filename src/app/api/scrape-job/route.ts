import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Scrape job details from a URL using Open Graph / meta tag extraction
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; JobTracker/1.0)",
                Accept: "text/html",
            },
            signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Could not fetch URL" }, { status: 422 });
        }

        const html = await response.text();

        // Extract meta tags
        const getMetaContent = (name: string): string | null => {
            const patterns = [
                new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']+)["']`, "i"),
                new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, "i"),
                new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${name}["']`, "i"),
                new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, "i"),
            ];
            for (const pattern of patterns) {
                const match = html.match(pattern);
                if (match) return match[1];
            }
            return null;
        };

        // Get title
        const ogTitle = getMetaContent("og:title");
        const twitterTitle = getMetaContent("twitter:title");
        const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
        const title = ogTitle || twitterTitle || titleTag || "";

        // Get site name / company
        const ogSiteName = getMetaContent("og:site_name");
        const company = ogSiteName || extractDomain(url);

        // Get description for location hints
        const ogDesc = getMetaContent("og:description");
        const metaDesc = getMetaContent("description");
        const description = ogDesc || metaDesc || "";

        // Try to extract location from description
        const location = extractLocation(description + " " + title);

        // Try to detect job type
        const fullText = (title + " " + description).toLowerCase();
        let jobType: string | undefined;
        if (fullText.includes("remote")) jobType = "REMOTE";
        else if (fullText.includes("hybrid")) jobType = "HYBRID";
        else if (fullText.includes("onsite") || fullText.includes("on-site")) jobType = "ONSITE";

        return NextResponse.json({
            title: cleanTitle(title, company),
            company,
            location,
            jobType,
            description: description.slice(0, 300),
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to scrape URL" }, { status: 500 });
    }
}

function extractDomain(url: string): string {
    try {
        const hostname = new URL(url).hostname;
        return hostname
            .replace(/^www\./, "")
            .replace(/\.(com|org|net|io|co)$/, "")
            .split(".")[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    } catch {
        return "";
    }
}

function cleanTitle(title: string, company: string): string {
    // Remove company name from title if present
    return title
        .replace(new RegExp(company, "gi"), "")
        .replace(/^[\s\-–|:]+|[\s\-–|:]+$/g, "")
        .trim();
}

function extractLocation(text: string): string | undefined {
    // Common location patterns
    const patterns = [
        /(?:location|based in|located in|office in)\s*[:\-–]?\s*([A-Z][a-zA-Z\s,]+)/i,
        /([A-Z][a-z]+(?:,\s*[A-Z]{2}))/,  // City, ST format
    ];
    for (const p of patterns) {
        const match = text.match(p);
        if (match) return match[1].trim();
    }
    return undefined;
}
