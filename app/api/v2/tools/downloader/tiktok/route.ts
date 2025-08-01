import { NextResponse } from "next/server";
import { siteConfig } from "@/settings/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    const apiResponse = await fetch("https://tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01"
      },
      body: new URLSearchParams({ url }),
    });

    if (!apiResponse.ok) {
        throw new Error(`External API failed with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    if (data.code !== 0) {
        throw new Error(data.msg || "Failed to scrape TikTok video.");
    }

    return NextResponse.json({
      status: true,
      platform: "tiktok",
      creator: siteConfig.api.creator,
      media_url: data.data.play,
      thumbnail: data.data.cover,
      author: {
        nickname: data.data.author.nickname,
        unique_id: data.data.author.unique_id,
      },
      version: "v2",
    });

  } catch (error) {
    console.error("TikTok Downloader Error:", error);
    return NextResponse.json({
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An unknown error occurred",
    }, { status: 500 });
  }
}
