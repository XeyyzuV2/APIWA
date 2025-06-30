"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ApiSearch } from "@/components/api-search"
import Link from "next/link"
import {
  ArrowLeft,
  Tag,
  PlayCircle,
  Copy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LinkIcon,
  Terminal,
  Loader2,
  Circle,
  Book,
  Code,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { siteConfig, getApiStatus, getStatusBadgeStyle } from "@/settings/config"

function getMediaTypeBadgeVariant(mediaType: string): "outline" {
  switch (mediaType) {
    case "application/json":
      return "outline"
    case "image/png":
      return "outline"
    case "image/jpeg":
      return "outline"
    case "text/plain":
      return "outline"
    case "application/octet-stream":
      return "outline"
    default:
      return "outline"
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

const generateEndpointId = (endpoint: any) => {
  const safePath = (endpoint.path ?? "").toString()
  return `endpoint${safePath.replace(/\//g, "-")}`
}

const getEndpointDocsLink = (endpoint: any) => {
  const safePath = (endpoint.path ?? "").toString()
  return `/docs#endpoint${safePath.replace(/\//g, "-")}`
}

const copyEndpointLink = (endpoint: any) => {
  const fullUrl = `${window.location.origin}${getEndpointDocsLink(endpoint)}`
  copyToClipboard(fullUrl)
}

export default function DocsPage() {
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
  const [selectedVersion, setSelectedVersion] = useState<string>(siteConfig.api.defaultVersion || "v2")
  const [filteredEndpoints, setFilteredEndpoints] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<string>("playground")

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      if (hash === "#documentation") {
        setActiveSection("documentation")
      } else if (hash === "#playground" || hash.startsWith("#endpoint-")) {
        setActiveSection("playground")
        const endpointPath = hash.replace("#endpoint-", "").replace(/-/g, "/")
        setOpenEndpoints((prev) => ({ ...prev, [`/${endpointPath}`]: true }))
        // Also open the category for this endpoint
        const category = siteConfig.apiCategories.find((cat) =>
          cat.endpoints.some((ep) => ep.path === `/${endpointPath}`),
        )
        if (category) {
          setOpenCategories((prev) => ({ ...prev, [category.name]: true }))
        }
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1))
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      }
    }
  }, [])

  const handleParamChange = (endpointPath: string, paramName: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [`${endpointPath}:${paramName}`]: value,
    }))
  }

  const executeEndpoint = async (endpoint: any) => {
    const apiStatus = getApiStatus(endpoint.path)

    // Check if endpoint is offline
    if (apiStatus.status === "offline") {
      setResults((prev) => ({
        ...prev,
        [endpoint.path]: {
          status: false,
          error: "This endpoint is currently offline and unavailable. Please try again later.",
          responseTime: 0,
        },
      }))
      return
    }

    setLoading((prev) => ({ ...prev, [endpoint.path]: true }))
    const startTime = performance.now()

    try {
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
        setDirectLinks((prev) => ({
          ...prev,
          [endpoint.path]: `/api/${selectedVersion}${endpoint.path}${queryString}`,
        }))
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

      if (!response) {
        throw new Error("Request failed before receiving a response")
      }

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
          const { responseTime: _, ...resultData } = data
          setResults((prev) => ({
            ...prev,
            [endpoint.path]: {
              ...resultData,
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
    const apiStatus = getApiStatus(path)

    // Prevent opening offline endpoints
    if (apiStatus.status === "offline") {
      return
    }

    setOpenEndpoints((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
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
          ? `?${endpoint.parameters.map((p: any) => `${p.name}=${p.name === "text" ? "Hello" : p.name === "model" ? "llama-3.1-8b-instant" : "value"}`).join("&")}`
          : ""
      }')
.then(response => response.json())
.then(data => console.log(data))`
    } else if (endpoint.method === "POST") {
      return `fetch('${siteConfig.api.baseUrl}/api/${selectedVersion}${endpoint.path}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ${endpoint.parameters.map((p: any) => `${p.name}: ${p.name === "text" ? '"Hello"' : p.name === "model" ? '"llama-3.1-8b-instant"' : p.name === "responses" ? "1" : '"value"'}`).join(",\n    ")}
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
          ? `?${endpoint.parameters.map((p: any) => `${p.name}=${p.name === "text" ? "Hello" : p.name === "model" ? "llama-3.1-8b-instant" : "value"}`).join("&")}`
          : ""
      }"`
    } else if (endpoint.method === "POST") {
      return `curl -X POST "${siteConfig.api.baseUrl}/api/${selectedVersion}${endpoint.path}" -H "Content-Type: application/json" -d '{"${endpoint.parameters.map((p: any) => `${p.name}":"${p.name === "text" ? "Hello" : p.name === "model" ? "llama-3.1-8b-instant" : p.name === "responses" ? "1" : "value"}`).join('","')}"}'`
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
    <>
      <NavBar />
      <main className="container py-12 sm:py-16 md:py-24 mt-12 sm:mt-14 md:mt-16 px-2 sm:px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 sm:mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 touch-manipulation active:scale-95">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">API Documentation</h1>
            <p className="text-xs sm:text-sm md:text-lg text-muted-foreground">
              Comprehensive guide and interactive testing for {siteConfig.name} endpoints
            </p>
          </div>

          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 h-10 sm:h-11">
              <TabsTrigger value="playground" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>API Playground</span>
              </TabsTrigger>
              <TabsTrigger
                value="documentation"
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              >
                <Book className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Documentation</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documentation" className="space-y-8">
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Getting Started</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Learn how to use our API endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 md:p-6">
                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2">Base URL</h3>
                    <pre className="bg-muted p-2 md:p-3 rounded-md text-xs md:text-sm overflow-x-auto">
                      <code>{siteConfig.api.baseUrl}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2">API Versioning</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {siteConfig.api.versions.map((version) => (
                        <Badge key={version} variant="outline" style={getVersionBadgeStyle(version)}>
                          {version.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    <pre className="bg-muted p-2 md:p-3 rounded-md text-xs md:text-sm overflow-x-auto">
                      <code>{`${siteConfig.api.baseUrl}/api/v2/endpoint`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2">Rate Limiting</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {siteConfig.api.rateLimit.limit} requests/{siteConfig.api.rateLimit.window}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Each client is allowed {siteConfig.api.rateLimit.limit} requests per{" "}
                      {siteConfig.api.rateLimit.window}. Rate limits are enforced per IP address.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2">Response Format</h3>
                    <pre className="bg-muted p-2 md:p-3 rounded-md text-xs md:text-sm overflow-x-auto">
                      <code>{`{
  "status": true,
  "creator": "${siteConfig.api.creator}",
  "result": {},
  "version": "v2"
}`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2">Error Handling</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      All errors return a JSON response with the following structure:
                    </p>
                    <pre className="bg-muted p-2 md:p-3 rounded-md text-xs md:text-sm overflow-x-auto">
                      <code>{`{
  "status": false,
  "creator": "${siteConfig.api.creator}",
  "error": "Error description",
  "version": "v2"
}`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playground" className="space-y-6">
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>API Playground</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Test our API endpoints directly from your browser
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs md:text-sm font-medium">API Version</h3>
                    </div>
                    <Tabs defaultValue={selectedVersion} className="w-full" onValueChange={setSelectedVersion}>
                      <TabsList className="grid grid-cols-2 w-full h-9 sm:h-10">
                        {siteConfig.api.versions.map((version) => (
                          <TabsTrigger key={version} value={version} className="text-xs sm:text-sm">
                            {version.toUpperCase()}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>

                  <ApiSearch onFilterChange={setFilteredEndpoints} />

                  <div className="grid gap-4">
                    {getFilteredCategories().map((category) => (
                      <Collapsible
                        key={category.name}
                        open={openCategories[category.name]}
                        onOpenChange={() => toggleCategory(category.name)}
                        className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-200"
                      >
                        <div
                          className="flex items-center p-3 cursor-pointer"
                          onClick={() => toggleCategory(category.name)}
                        >
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
                            <Badge
                              variant="outline"
                              className="font-medium text-xs"
                              style={getCategoryStyle(category.name)}
                            >
                              {category.name}
                            </Badge>
                            <span className="text-sm font-medium">{category.name} APIs</span>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="border-t p-2">
                            <div className="grid gap-3">
                              {category.endpoints.map((endpoint, index) => {
                                const apiStatus = getApiStatus(endpoint.path)
                                const endpointId = generateEndpointId(endpoint)
                                const isOffline = apiStatus.status === "offline"

                                return (
                                  <div
                                    key={index}
                                    className={`rounded-lg border text-card-foreground shadow-sm overflow-hidden transition-all duration-200 ${
                                      isOffline
                                        ? "bg-red-500/5 border-red-500/20 opacity-60 cursor-not-allowed"
                                        : "bg-card/50 cursor-pointer"
                                    }`}
                                  >
                                    <div
                                      id={endpointId}
                                      className="flex items-center p-2"
                                      onClick={() => !isOffline && toggleEndpoint(endpoint.path)}
                                    >
                                      {!isOffline && (
                                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                                          {openEndpoints[endpoint.path] ? (
                                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                          )}
                                        </Button>
                                      )}

                                      {isOffline && (
                                        <div className="p-0 h-auto w-6 flex items-center justify-center">
                                          <XCircle className="h-3 w-3 text-red-500" />
                                        </div>
                                      )}

                                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-grow ml-2 overflow-hidden">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <Badge variant={endpoint.method.toLowerCase() as any}>
                                            {endpoint.method}
                                          </Badge>
                                          <span className="font-mono text-xs sm:text-sm font-medium truncate">
                                            {endpoint.path}
                                          </span>

                                          <Badge variant="outline" style={getStatusBadgeStyle(apiStatus.status)}>
                                            <Circle className="h-2 w-2 mr-1 fill-current" />
                                            {apiStatus.status}
                                          </Badge>

                                          {isOffline && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs bg-red-500/10 text-red-500 border-red-500/30"
                                            >
                                              Unavailable
                                            </Badge>
                                          )}

                                          {endpoint.mediaType && !isOffline && (
                                            <Badge variant={getMediaTypeBadgeVariant(endpoint.mediaType)}>
                                              {siteConfig.mediaTypes.find((m) => m.type === endpoint.mediaType)
                                                ?.badge || "DATA"}
                                            </Badge>
                                          )}

                                          {executedEndpoints[endpoint.path] && !isOffline && (
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
                                        <p className="text-xs text-muted-foreground sm:ml-auto truncate">
                                          {endpoint.description}
                                        </p>
                                      </div>
                                    </div>

                                    {isOffline && (
                                      <div className="border-t p-3 bg-red-500/5">
                                        <div className="flex items-center gap-2 text-red-500 mb-2">
                                          <AlertTriangle className="h-4 w-4" />
                                          <span className="text-sm font-medium">Endpoint Offline</span>
                                        </div>
                                        <p className="text-xs text-red-600">
                                          This endpoint is currently offline and unavailable for testing. Please check
                                          back later.
                                        </p>
                                      </div>
                                    )}

                                    {!isOffline && (
                                      <Collapsible
                                        open={openEndpoints[endpoint.path]}
                                        onOpenChange={() => toggleEndpoint(endpoint.path)}
                                      >
                                        <CollapsibleContent>
                                          <div className="border-t p-3">
                                            <div className="grid gap-3">
                                              <div className="flex items-center gap-2">
                                                <Badge variant="outline" style={getVersionBadgeStyle(selectedVersion)}>
                                                  {selectedVersion.toUpperCase()}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                  Using API version {selectedVersion}
                                                </span>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-6 text-xs ml-auto"
                                                  onClick={() => copyEndpointLink(endpoint)}
                                                >
                                                  <LinkIcon className="h-3 w-3 mr-1" />
                                                  Share
                                                </Button>
                                              </div>

                                              <div className="space-y-1">
                                                <h3 className="text-xs font-medium">API Status</h3>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                  <div className="flex items-center gap-1">
                                                    <Circle
                                                      className="h-2 w-2 fill-current"
                                                      style={{
                                                        color:
                                                          apiStatus.status === "online"
                                                            ? "rgb(34, 197, 94)"
                                                            : apiStatus.status === "degraded"
                                                              ? "rgb(234, 179, 8)"
                                                              : "rgb(239, 68, 68)",
                                                      }}
                                                    />
                                                    <span>{apiStatus.status}</span>
                                                  </div>
                                                  <span>Response: {apiStatus.responseTime}ms</span>
                                                  <span>Uptime: {apiStatus.uptime}%</span>
                                                </div>
                                              </div>

                                              {endpoint.parameters.length > 0 && (
                                                <div className="space-y-3">
                                                  <h3 className="text-xs font-medium">Parameters</h3>
                                                  <div className="grid gap-2 sm:grid-cols-2">
                                                    {endpoint.parameters.map((param: any, paramIndex: number) => (
                                                      <div key={paramIndex} className="flex flex-col">
                                                        <label className="text-xs mb-1">
                                                          {param.name}{" "}
                                                          {param.required && <span className="text-red-500">*</span>}
                                                        </label>
                                                        <Input
                                                          placeholder={param.description}
                                                          value={params[`${endpoint.path}:${param.name}`] || ""}
                                                          onChange={(e) =>
                                                            handleParamChange(endpoint.path, param.name, e.target.value)
                                                          }
                                                          className="h-8 text-xs"
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
                                                    )
                                                  }
                                                  className="h-8 text-xs px-3 py-1"
                                                  size="sm"
                                                >
                                                  {loading[endpoint.path] ? (
                                                    <>
                                                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                      Executing...
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
                                                  className="h-8 text-xs px-3 py-1 bg-transparent"
                                                  onClick={() =>
                                                    copyToClipboard(
                                                      activeTab[endpoint.path] === "curl"
                                                        ? getCurlExample(endpoint)
                                                        : getEndpointExample(endpoint),
                                                    )
                                                  }
                                                >
                                                  <Copy className="mr-1 h-3 w-3" />
                                                  Copy Example
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
                                                    <code className="text-xs flex-1 overflow-x-auto">
                                                      {directLinks[endpoint.path]}
                                                    </code>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                                      <a
                                                        href={directLinks[endpoint.path]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
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
                                                        style={getResponseTimeColor(
                                                          results[endpoint.path].responseTime,
                                                        )}
                                                        className="text-xs"
                                                      >
                                                        {results[endpoint.path].responseTime} ms
                                                      </Badge>
                                                    )}
                                                  </div>
                                                  <div className="rounded-lg bg-muted p-2 max-h-60 overflow-auto">
                                                    {endpoint.path === "/random/ba" &&
                                                    results[endpoint.path].imageUrl ? (
                                                      <div className="flex justify-center">
                                                        <img
                                                          src={results[endpoint.path].imageUrl || "/placeholder.svg"}
                                                          alt="Random Blue Archive"
                                                          className="max-h-56 rounded-md"
                                                        />
                                                      </div>
                                                    ) : (
                                                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                                                        <code>
                                                          {JSON.stringify(
                                                            Object.fromEntries(
                                                              Object.entries(results[endpoint.path]).filter(
                                                                ([key]) => key !== "responseTime",
                                                              ),
                                                            ),
                                                            null,
                                                            2,
                                                          )}
                                                        </code>
                                                      </pre>
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center text-xs text-muted-foreground">{siteConfig.copyright}</div>
        </div>
      </main>
    </>
  )
}
