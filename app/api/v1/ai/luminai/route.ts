import { NextResponse } from "next/server"
import { siteConfig } from "@/settings/config"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get("text")

  if (!text) {
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: "Text is required",
      },
      { status: 400 }
    )
  }

  try {
    const response = await fetch("https://luminai.my.id/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    })

    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({
            status: false,
            creator: siteConfig.api.creator,
            error: `External API error: ${errorText}`
        }, { status: response.status });
    }

    const data = await response.json()

    return NextResponse.json(
      {
        status: true,
        creator: siteConfig.api.creator,
        result: data.result,
        version: "v1",
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    )
  }
}
