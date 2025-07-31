import { NextResponse } from "next/server"
import { siteConfig, getApiStatus } from "@/settings/config"

const API_TIMEOUT = 10000

async function hydromind(content: string, model: string, responses?: number) {
  const formData = new FormData()
  formData.append("content", content)
  formData.append("model", model)
  if (responses) {
    formData.append("responses", responses.toString())
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch("https://mind.hydrooo.web.id/v1/chat/", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    // It might return text or json, handle both
    const responseText = await response.text()
    try {
      return JSON.parse(responseText)
    } catch {
      return { result: responseText.trim() }
    }

  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("External API request timed out after 10 seconds")
    }
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, model, responses } = body

    if (!text || !model) {
      return NextResponse.json({
          status: false,
          creator: siteConfig.api.creator,
          error: "Text and Model are required",
      }, { status: 400 });
    }

    const data = await hydromind(text, model, responses ? Number(responses) : undefined)
    return NextResponse.json({
        status: true,
        creator: siteConfig.api.creator,
        result: data.result,
        version: "v2",
    });

  } catch (error) {
    return NextResponse.json({
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
    }, { status: 500 });
  }
}

export async function GET() {
  const apiStatus = getApiStatus("/ai/hydromind")
  return NextResponse.json({
      status: true,
      creator: siteConfig.api.creator,
      message: "HydroMind API endpoint",
      apiStatus: apiStatus.status,
      version: "v2",
  });
}
