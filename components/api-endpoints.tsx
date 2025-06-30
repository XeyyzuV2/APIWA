"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Loader2,
  PlayCircle,
  Copy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LinkIcon,
  Terminal,
  AlertCircle,
  Tag,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/settings/config"
import { ApiVersionSelector } from "@/components/api-version-selector"
import { ApiSearch } from "@/components/api-search"

function getMediaTypeBadgeVariant(mediaType: string): "outline" {
  switch (mediaType) {
    case "application/json":
      return "outline"
    case "application/xml":
      return "outline"
    case "application/pdf":
      return "outline"
    case "text/csv":
      return "outline"
    case "text/html":
      return "outline"
    case "text/plain":
      return "outline"

    case "image/png":
      return "outline"
    case "image/jpeg":
      return "outline"
    case "image/gif":
      return "outline"
    case "image/svg+xml":
      return "outline"
    case "image/webp":
      return "outline"

    case "audio/mp3":
      return "outline"
    case "audio/wav":
      return "outline"

    case "video/mp4":
      return "outline"
    case "video/webm":
      return "outline"

    case "application/zip":
      return "outline"

    case "application/octet-stream":
      return "outline"

    default:
      return "outline"
  }
}

function getStatusCodeStyle(code: number): React.CSSProperties {
  if (code >= 200 && code < 300) {
    return {
      borderColor: "rgba(34, 197, 94, 0.3)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "rgb(34, 197, 94)",
    }
  }
  if (code >= 300 && code < 400) {
    return {
      borderColor: "rgba(59, 130, 246, 0.3)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      color: "rgb(59, 130, 246)",
    }
  }
  if (code >= 400 && code < 500) {
    return {
      borderColor: "rgba(234, 179, 8, 0.3)",
      backgroundColor: "rgba(234, 179, 8, 0.1)",
      color: "rgb(234, 179, 8)",
    }
  }
  if (code >= 500) {
    return {
      borderColor: "rgba(239, 68, 68, 0.3)",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "rgb(239, 68, 68)",
    }
  }
  return {
    borderColor: "rgba(148, 163, 184, 0.3)",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    color: "rgb(148, 163, 184)",
  }
}

function getCategoryStyle(category: string): React.CSSProperties {
  const categoryConfig = siteConfig.apiCategories.find((c) => c.name === category)

  switch (categoryConfig?.color) {
    case "blue":
      return {
        borderColor: "rgba(59, 130, 246, 0.3)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        color: "rgb(59, 130, 246)",
      }
    case "purple":
      return {
        borderColor: "rgba(168, 85, 247, 0.3)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        color: "rgb(168, 85, 247)",
      }
    case "green":
      return {
        borderColor: "rgba(34, 197, 94, 0.3)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "rgb(34, 197, 94)",
      }
    case "yellow":
      return {
        borderColor: "rgba(234, 179, 8, 0.3)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        color: "rgb(234, 179, 8)",
      }
    case "red":
      return {
        borderColor: "rgba(239, 68, 68, 0.3)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "rgb(239, 68, 68)",
      }
    default:
      return {
        borderColor: "rgba(148, 163, 184, 0.3)",
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        color: "rgb(148, 163, 184)",
      }
  }
}

function getVersionBadgeStyle(version: string): React.CSSProperties {
  switch (version) {
    case "v1":
      return {
        borderColor: "rgba(59, 130, 246, 0.3)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        color: "rgb(59, 130, 246)",
      }
    case "v2":
      return {
        borderColor: "rgba(34, 197, 94, 0.3)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "rgb(34, 197, 94)",
      }
    default:
      return {
        borderColor: "rgba(148, 163, 184, 0.3)",
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        color: "rgb(148, 163, 184)",
      }
  }
}

const getResponseTimeColor = (ms: number): React.CSSProperties => {
  if (ms < 300) {
    return {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "rgb(34, 197, 94)",
      borderColor: "rgba(34, 197, 94, 0.3)",
    }
  } else if (ms < 1000) {
    return {
      backgroundColor: "rgba(234, 179, 8, 0.1)",
      color: "rgb(234, 179, 8)",
      borderColor: "rgba(234, 179, 8, 0.3)",
    }
  } else {
    return {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "rgb(239, 68, 68)",
      borderColor: "rgba(239, 68, 68, 0.3)",
    }
  }
}

const copyToClipboard = (text: string) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Copied to clipboard successfully")
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          fallbackCopyToClipboard(text)
        })
    } else {
      fallbackCopyToClipboard(text)
    }
  } catch (error) {
    console.error("Copy to clipboard error:", error)
    fallbackCopyToClipboard(text)
  }
}

const fallbackCopyToClipboard = (text: string) => {
  try {
    const textArea = document.createElement("textarea")
    textArea.value = text

    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)

    textArea.focus()
    textArea.select()

    const successful = document.execCommand("copy")
    document.body.removeChild(textArea)

    if (!successful) {
      console.error("Fallback copy method failed")
    }
  } catch (err) {
    console.error("Fallback copy method failed:", err)
  }
}

const copyEndpointLink = (endpoint: any) => {
  const fullUrl = `${window.location.origin}${getEndpointDocsLink(endpoint)}`
  copyToClipboard(fullUrl)
}

const getEndpointDocsLink = (endpoint: any) => {
  const safePath = (endpoint.path ?? "").toString()
  return `/docs#endpoint${safePath.replace(/\//g, "-")}`
}

const generateEndpointId = (endpoint: any) => {
  const safePath = (endpoint.path ?? "").toString()
  return `endpoint${safePath.replace(/\//g, "-")}`
}

export function ApiEndpoints() {
  const [params, setParams] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [openEndpoints, setOpenEndpoints] = useState<Record<string, boolean>>({})
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(siteConfig.apiCategories.map((cat) => [cat.name, true])),
  )
  const [executedEndpoints, setExecutedEndpoints] = useState<Record<string, boolean>>({})
  const [directLinks, setDirectLinks] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<Record<string, string>>({})
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({})
  const [selectedVersion, setSelectedVersion] = useState<string>(siteConfig.api.defaultVersion || "v2")
  const [filteredEndpoints, setFilteredEndpoints] = useState<any[]>([])

  const handleParamChange = (endpointPath: string, paramName: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [`${endpointPath}:${paramName}`]: value,
    }))
  }

  const checkApiStatus = async (endpoint: any) => {
    if (endpoint.path === "/ai/hydromind") {
      try {
        const response = await fetch(`/api/${selectedVersion}${endpoint.path}`)
        const data = await response.json()
        setApiStatus((prev) => ({ ...prev, [endpoint.path]: data.status }))
        return data.status
      } catch (error) {
        setApiStatus((prev) => ({ ...prev, [endpoint.path]: false }))
        return false
      }
    }
    return true
  }

  const executeEndpoint = async (endpoint: any) => {
    setLoading((prev) => ({ ...prev, [endpoint.path]: true }))
    const startTime = performance.now()

    try {
      if (endpoint.path === "/ai/hydromind") {
        const isAvailable = await checkApiStatus(endpoint)
        if (!isAvailable) {
          setResults((prev) => ({
            ...prev,
            [endpoint.path]: {
              status: false,
              error: "External API is currently unavailable. Please try again later.",
            },
          }))
          setLoading((prev) => ({ ...prev, [endpoint.path]: false }))
          return
        }
      }

      const endpointParams: Record<string, string> = {}
      endpoint.parameters.forEach((param: any) => {
        endpointParams[param.name] = params[`${endpoint.path}:${param.name}`] || ""
      })

      let response

      if (endpoint.method === "GET") {
        const queryParams = new URLSearchParams()
        Object.entries(endpointParams).forEach(([key, value]) => {
          if (value) queryParams.append(key, value)
        })

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
        response = await fetch(`/api/${selectedVersion}${endpoint.path}${queryString}`)

        const directLink = `/api/${selectedVersion}${endpoint.path}${queryString}`
        setDirectLinks((prev) => ({ ...prev, [endpoint.path]: directLink }))
      } else if (endpoint.method === "POST") {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        try {
          response = await fetch(`/api/${selectedVersion}${endpoint.path}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(endpointParams),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          setDirectLinks((prev) => ({ ...prev, [endpoint.path]: `/api/${selectedVersion}${endpoint.path}` }))
        } catch (error) {
          clearTimeout(timeoutId)
          if (error instanceof Error && error.name === "AbortError") {
            throw new Error("Request timed out. The server took too long to respond.")
          }
          throw error as Error
        }
      }

      if (!response) {
        throw new Error("Request failed before receiving a response")
      }

      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)

      if (endpoint.path === "/random/ba") {
        const blob = await response.blob()
        setResults((prev) => ({
          ...prev,
          [endpoint.path]: {
            imageUrl: URL.createObjectURL(blob),
            responseTime: responseTime,
          },
        }))
      } else {
        try {
          const data = await response.json()
          setResults((prev) => ({
            ...prev,
            [endpoint.path]: {
              ...data,
              responseTime: responseTime,
            },
          }))
        } catch (error) {
          const text = await response.text()
          setResults((prev) => ({
            ...prev,
            [endpoint.path]: {
              status: false,
              error: `Failed to parse response: ${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`,
              responseTime: responseTime,
            },
          }))
        }
      }

      setExecutedEndpoints((prev) => ({
        ...prev,
        [endpoint.path]: true,
      }))
    } catch (error) {
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)

      setResults((prev) => ({
        ...prev,
        [endpoint.path]: {
          status: false,
          error: error instanceof Error ? error.message : "An error occurred",
          responseTime: responseTime,
        },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint.path]: false }))
    }
  }

  const toggleEndpoint = (path: string) => {
    setOpenEndpoints((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))

    if (path === "/ai/hydromind" && !openEndpoints[path]) {
      checkApiStatus({ path })
    }
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const getEndpointExample = (endpoint: any) => {
    if (endpoint.method === "GET") {
      return `fetch('${siteConfig.api.baseUrl}/api/${selectedVersion}${endpoint.path}${
        endpoint.parameters.length > 0
          ? `?${endpoint.parameters.map((p: any) => `${p.name}=${p.name === "text" ? "Hello" : p.name === "model" ? "@groq/qwen-2.5-32b" : "value"}`).join("&")}`
          : ""
      }')
${
  endpoint.path === "/random/ba"
    ? `.then(response => response.blob())
.then(blob => {
  const url = URL.createObjectURL(blob)
  // Use the image URL
})`
    : `.then(response => response.json())
.then(data => console.log(data))`
}`
    } else if (endpoint.method === "POST") {
      return `fetch('${siteConfig.api.baseUrl}/api/${selectedVersion}${endpoint.path}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ${endpoint.parameters.map((p: any) => `${p.name}: ${p.name === "text" ? '"Hello"' : p.name === "model" ? '"@groq/qwen-2.5-32b"' : p.name === "responses" ? "1" : '"value"'}`).join(",\n    ")}
  }),
})
.then(response => response.json())
.then(data => console.log(data))`
    }
  }

  const getCurlExample = (endpoint: any) => {
    if (endpoint.method === "GET") {
      return `curl -X GET "${siteConfig.api.baseUrl}/api/${selectedVersion}${endpoint.path}${
        endpoint.parameters.length > 0
          ? `?${endpoint.parameters.map((p: any) => `${p.name}=${p.name === "text" ? "Hello" : p.name === "model" ? "@groq/qwen-2.5-32b" : "value"}`).join("&")}`
          : ""
      }"`
    } else if (endpoint.method === "POST") {
      return `curl -X POST "${siteConfig.api.baseUrl}/api/${selectedVersion}${endpoint.path}" -H "Content-Type: application/json" -d '{"${endpoint.parameters.map((p: any) => `${p.name}":"${p.name === "text" ? "Hello" : p.name === "model" ? "@groq/qwen-2.5-32b" : p.name === "responses" ? "1" : "value"}`).join('","')}"}'`
    }
  }

  const setTab = (path: string, tab: string) => {
    setActiveTab((prev) => ({
      ...prev,
      [path]: tab,
    }))
  }

  const getFilteredCategories = () => {
    if (filteredEndpoints.length === 0) {
      return siteConfig.apiCategories
    }

    const categoriesWithEndpoints = siteConfig.apiCategories
      .map((category) => ({
        ...category,
        endpoints: category.endpoints.filter((endpoint) =>
          filteredEndpoints.some((filtered) => filtered.path === endpoint.path && filtered.method === endpoint.method),
        ),
      }))
      .filter((category) => category.endpoints.length > 0)

    return categoriesWithEndpoints
  }

  return (
    <section
      id="api-endpoints"
      className="container py-12 sm:py-16 md:py-20 morph-animation px-2 sm:px-4"
      data-component="api-endpoints-section"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 sm:mb-4 text-center text-xl sm:text-2xl md:text-3xl font-bold">API Playground</h2>
        <p className="mb-6 sm:mb-8 text-center text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto px-2">
          Test and explore our API endpoints directly from your browser
        </p>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs md:text-sm font-medium">API Version</h3>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="text-xs text-muted-foreground">
                Rate Limit: {siteConfig.api.rateLimit.limit} requests/{siteConfig.api.rateLimit.window}
              </span>
            </div>
          </div>
          <ApiVersionSelector selectedVersion={selectedVersion} onVersionChange={setSelectedVersion} />
        </div>

        <ApiSearch onFilterChange={setFilteredEndpoints} />

        <div className="grid gap-4">
          {getFilteredCategories().map((category) => (
            <Collapsible
              key={category.name}
              open={openCategories[category.name]}
              onOpenChange={() => toggleCategory(category.name)}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-200 morph-item"
            >
              <div className="flex items-center p-3 cursor-pointer" onClick={() => toggleCategory(category.name)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    {openCategories[category.name] ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <div className="flex items-center gap-2 ml-2">
                  <Badge variant="outline" className="font-medium text-xs" style={getCategoryStyle(category.name)}>
                    {category.name}
                  </Badge>
                  <span className="text-sm font-medium">{category.name} APIs</span>
                </div>
              </div>

              <CollapsibleContent>
                <div className="border-t p-2">
                  <div className="grid gap-3">
                    {category.endpoints.map((endpoint, index) => (
                      <Collapsible
                        key={index}
                        open={openEndpoints[endpoint.path]}
                        onOpenChange={() => toggleEndpoint(endpoint.path)}
                        className="rounded-lg border bg-card/50 text-card-foreground shadow-sm overflow-hidden transition-all duration-200 morph-item-inner"
                      >
                        <div
                          className="flex items-center p-2 cursor-pointer"
                          onClick={() => toggleEndpoint(endpoint.path)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                              {openEndpoints[endpoint.path] ? (
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              )}
                            </Button>
                          </CollapsibleTrigger>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-grow ml-2 overflow-hidden">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge variant={endpoint.method.toLowerCase() as any}>{endpoint.method}</Badge>
                              <span className="font-mono text-xs sm:text-sm font-medium truncate">{endpoint.path}</span>

                              {endpoint.mediaType && (
                                <Badge variant={getMediaTypeBadgeVariant(endpoint.mediaType)}>
                                  {siteConfig.mediaTypes.find((m) => m.type === endpoint.mediaType)?.badge || "DATA"}
                                </Badge>
                              )}

                              {executedEndpoints[endpoint.path] && (
                                <Badge
                                  variant="outline"
                                  style={{
                                    borderColor: "rgba(34, 197, 94, 0.3)",
                                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                                    color: "rgb(34, 197, 94)",
                                  }}
                                  className="text-xs"
                                >
                                  Executed
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground sm:ml-auto truncate">{endpoint.description}</p>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="border-t p-3">
                            <div className="grid gap-3">
                              {endpoint.path === "/ai/hydromind" && apiStatus[endpoint.path] === false && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-500">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-xs">
                                    The external API is currently unavailable. Requests may fail or time out.
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <Badge variant="outline" style={getVersionBadgeStyle(selectedVersion)}>
                                  {selectedVersion.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Using API version {selectedVersion}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h3 className="text-xs font-medium">Media Type</h3>
                                <div className="flex items-center gap-2">
                                  <Badge variant={getMediaTypeBadgeVariant(endpoint.mediaType)}>
                                    {siteConfig.mediaTypes.find((m) => m.type === endpoint.mediaType)?.badge || "DATA"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{endpoint.mediaType}</span>
                                </div>
                              </div>

                              {endpoint.parameters.length > 0 && (
                                <div className="space-y-3">
                                  <h3 className="text-xs font-medium">Parameters</h3>
                                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                    {endpoint.parameters.map((param: any, paramIndex: number) => (
                                      <div key={paramIndex} className="flex flex-col">
                                        <label className="text-xs mb-1">
                                          {param.name} {param.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <Input
                                          placeholder={param.description}
                                          value={params[`${endpoint.path}:${param.name}`] || ""}
                                          onChange={(e) => handleParamChange(endpoint.path, param.name, e.target.value)}
                                          className="h-8 sm:h-9 text-xs sm:text-sm"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  onClick={() => executeEndpoint(endpoint)}
                                  disabled={
                                    loading[endpoint.path] ||
                                    endpoint.parameters.some(
                                      (p: any) => p.required && !params[`${endpoint.path}:${p.name}`],
                                    ) ||
                                    (endpoint.path === "/ai/hydromind" && apiStatus[endpoint.path] === false)
                                  }
                                  className="h-8 sm:h-9 text-xs px-3 py-1 morph-button touch-manipulation active:scale-95"
                                  size="sm"
                                >
                                  {loading[endpoint.path] ? (
                                    <>
                                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                      <span className="hidden sm:inline">Executing...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="mr-1 h-3 w-3" />
                                      Execute
                                    </>
                                  )}
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 sm:h-9 text-xs px-3 py-1 morph-button touch-manipulation active:scale-95 bg-transparent"
                                  onClick={() =>
                                    copyToClipboard(
                                      activeTab[endpoint.path] === "curl"
                                        ? getCurlExample(endpoint)
                                        : getEndpointExample(endpoint),
                                    )
                                  }
                                >
                                  <Copy className="mr-1 h-3 w-3" />
                                  <span className="hidden sm:inline">Copy Example</span>
                                  <span className="sm:hidden">Copy</span>
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 sm:h-9 text-xs px-3 py-1 morph-button touch-manipulation active:scale-95"
                                  asChild
                                >
                                  <a href={getEndpointDocsLink(endpoint)} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    <span className="hidden sm:inline">View Docs</span>
                                    <span className="sm:hidden">Docs</span>
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 sm:h-9 text-xs px-3 py-1 morph-button touch-manipulation active:scale-95"
                                  onClick={() => copyEndpointLink(endpoint)}
                                >
                                  <LinkIcon className="mr-1 h-3 w-3" />
                                  <span className="hidden sm:inline">Share Link</span>
                                  <span className="sm:hidden">Share</span>
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <div className="flex border-b">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 text-xs px-3 py-1 rounded-none ${activeTab[endpoint.path] !== "curl" ? "border-b-2 border-primary" : ""}`}
                                    onClick={() => setTab(endpoint.path, "fetch")}
                                  >
                                    Fetch
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 text-xs px-3 py-1 rounded-none ${activeTab[endpoint.path] === "curl" ? "border-b-2 border-primary" : ""}`}
                                    onClick={() => setTab(endpoint.path, "curl")}
                                  >
                                    <Terminal className="mr-1 h-3 w-3" />
                                    cURL
                                  </Button>
                                </div>
                                <pre className="overflow-x-auto rounded-lg bg-muted p-2 text-xs">
                                  <code>
                                    {activeTab[endpoint.path] === "curl"
                                      ? getCurlExample(endpoint)
                                      : getEndpointExample(endpoint)}
                                  </code>
                                </pre>
                              </div>

                              {directLinks[endpoint.path] && (
                                <div className="space-y-2">
                                  <h3 className="text-xs font-medium">Direct API Access</h3>
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                                    <LinkIcon className="h-3 w-3 text-muted-foreground" />
                                    <code className="text-xs flex-1 overflow-x-auto">{directLinks[endpoint.path]}</code>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                      <a href={directLinks[endpoint.path]} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {results[endpoint.path] && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium">Result</h3>
                                    {results[endpoint.path].responseTime && (
                                      <Badge
                                        variant="outline"
                                        style={getResponseTimeColor(results[endpoint.path].responseTime)}
                                        className="text-xs"
                                      >
                                        {results[endpoint.path].responseTime} ms
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="rounded-lg bg-muted p-2 max-h-60 overflow-auto">
                                    {endpoint.path === "/random/ba" && results[endpoint.path].imageUrl ? (
                                      <div className="flex justify-center">
                                        <img
                                          src={results[endpoint.path].imageUrl || "/placeholder.svg"}
                                          alt="Random Blue Archive"
                                          className="max-h-56 rounded-md"
                                        />
                                      </div>
                                    ) : (
                                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                                        <code>{JSON.stringify(results[endpoint.path], null, 2)}</code>
                                      </pre>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center text-xs text-muted-foreground">{siteConfig.copyright}</div>
    </section>
  )
}
