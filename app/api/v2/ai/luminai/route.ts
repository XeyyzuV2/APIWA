import { NextResponse } from "next/server"
import { siteConfig, getApiStatus } from "@/settings/config"

export async function GET(request: Request) {
  const apiStatus = getApiStatus("/ai/luminai")

  if (apiStatus.status === "offline") {
    return new NextResponse(
      JSON.stringify(
        {
          status: false,
          creator: siteConfig.api.creator,
          error: "This API endpoint is currently offline and unavailable. Please try again later.",
          endpoint: "/ai/luminai",
          apiStatus: "offline",
          version: "v2",
        },
        null,
        2,
      ),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }

  if (siteConfig.maintenance.enabled) {
    return new NextResponse(
      JSON.stringify(
        {
          status: siteConfig.maintenance.apiResponse.status,
          creator: siteConfig.api.creator,
          message: siteConfig.maintenance.apiResponse.message,
        },
        null,
        2,
      ),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }

  const { searchParams } = new URL(request.url)
  const text = searchParams.get("text")

  if (!text) {
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: "Text is required",
      },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }

  try {
    const response = await fetch("https://luminai.my.id/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    })

    const data = await response.json()

    return new NextResponse(
      JSON.stringify(
        {
          status: true,
          creator: siteConfig.api.creator,
          result: data.result,
          version: "v2",
        },
        null,
        2,
      ),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  } catch (error) {
    return new NextResponse(
      JSON.stringify(
        {
          status: false,
          creator: siteConfig.api.creator,
          error: error instanceof Error ? error.message : "An error occurred",
        },
        null,
        2,
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }
}
