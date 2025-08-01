import { NextResponse } from "next/server";
import cheerio from "cheerio";
import { siteConfig } from "@/settings/config";

export const dynamic = "force-dynamic";

// --- Platform-specific Scrapers ---

async function scrapeTikTok(url: URL) {
    try {
        const response = await fetch(url.toString(), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        // TikTok embeds data in a script tag with id '__NEXT_DATA__'
        const jsonData = $('#__NEXT_DATA__').html();
        if (!jsonData) throw new Error("Could not find __NEXT_DATA__ script tag.");

        const data = JSON.parse(jsonData);
        const videoData = data.props.pageProps.itemInfo.itemStruct.video;

        if (!videoData) throw new Error("Video data not found in JSON.");

        return {
            platform: "tiktok",
            media_url: videoData.playAddr,
            thumbnail: videoData.cover,
            creator: data.props.pageProps.itemInfo.itemStruct.author.uniqueId,
        };
    } catch (error) {
        console.error("TikTok Scraper Error:", error);
        throw new Error("Failed to scrape TikTok video.");
    }
}

async function scrapeInstagram(url: URL) {
    try {
        const response = await fetch(url.toString(), {
            headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1' }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        const videoUrl = $('meta[property="og:video"]').attr('content');
        const imageUrl = $('meta[property="og:image"]').attr('content');
        const creator = $('meta[property="og:title"]').attr('content')?.split(' on Instagram')[0] || 'Unknown';

        if (!videoUrl && !imageUrl) throw new Error("Could not find media URL in meta tags.");

        return {
            platform: "instagram",
            media_url: videoUrl || imageUrl,
            thumbnail: imageUrl,
            creator,
        };
    } catch (error) {
        console.error("Instagram Scraper Error:", error);
        throw new Error("Failed to scrape Instagram media.");
    }
}

// ... other scrapers will be added here

// --- Main Handler ---

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url");
  const download = searchParams.get("download") === 'true';

  if (!urlParam) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    const url = new URL(urlParam);
    let result;

    if (url.hostname.includes("tiktok.com")) {
        result = await scrapeTikTok(url);
    } else if (url.hostname.includes("instagram.com")) {
        result = await scrapeInstagram(url);
    } else {
        return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
    }

    if (download && result.media_url) {
        const fileResponse = await fetch(result.media_url);
        if (!fileResponse.ok) throw new Error("Failed to fetch final media file.");

        const buffer = await fileResponse.arrayBuffer();
        const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

        return new Response(buffer, {
            headers: { "Content-Type": contentType }
        });
    }

    return NextResponse.json({
        status: true,
        creator: siteConfig.api.creator,
        ...result,
        version: "v2",
    });

  } catch (error) {
    console.error("Downloader error:", error);
    return NextResponse.json({
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An unknown error occurred",
    }, { status: 500 });
  }
}
