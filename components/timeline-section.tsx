"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Code, Zap, Globe, Shield, Sparkles, ExternalLink, Clock } from "lucide-react"
import { siteConfig } from "@/settings/config"

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  version?: string
  status: "completed" | "active" | "upcoming"
  type: "launch" | "update" | "feature" | "milestone" | "maintenance"
  details?: string[]
  link?: string
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "VGX REST API Launch",
    description: "Platform API pertama kali diluncurkan dengan endpoint dasar untuk AI dan random content",
    date: "15 Januari 2024",
    version: "v1.0.0",
    status: "completed",
    type: "launch",
    details: [
      "Endpoint AI LuminAI pertama kali tersedia",
      "Random Blue Archive image generator",
      "Sistem rate limiting dasar",
      "Dokumentasi API sederhana",
    ],
  },
  {
    id: "2",
    title: "Multi-Version Support",
    description: "Implementasi sistem versioning API dengan dukungan v1 dan v2 untuk backward compatibility",
    date: "28 Februari 2024",
    version: "v1.5.0",
    status: "completed",
    type: "feature",
    details: [
      "API versioning system (v1/v2)",
      "Enhanced error handling",
      "Improved response format",
      "Better rate limiting",
    ],
  },
  {
    id: "3",
    title: "HydroMind AI Integration",
    description: "Penambahan endpoint AI HydroMind dengan dukungan multiple model dan parameter kustomisasi",
    date: "20 Maret 2024",
    version: "v2.0.0",
    status: "completed",
    type: "feature",
    details: [
      "HydroMind AI endpoint",
      "Multiple AI model support",
      "Custom response parameters",
      "Advanced timeout handling",
    ],
  },
  {
    id: "4",
    title: "Enhanced Documentation",
    description: "Peluncuran dokumentasi interaktif dengan API playground dan testing tools",
    date: "10 Mei 2024",
    version: "v2.5.0",
    status: "completed",
    type: "update",
    details: [
      "Interactive API playground",
      "Real-time endpoint testing",
      "Enhanced code examples",
      "Mobile-responsive design",
    ],
  },
  {
    id: "5",
    title: "Rate Limit Enhancement",
    description: "Peningkatan rate limit menjadi 500 requests per 2 jam untuk performa yang lebih baik",
    date: "22 Januari 2025",
    version: "v3.0.0",
    status: "active",
    type: "update",
    details: [
      "Increased rate limit (500/2h)",
      "Better rate limit headers",
      "Enhanced security measures",
      "Improved error messages",
    ],
  },
  {
    id: "6",
    title: "Advanced Features & UI",
    description: "Implementasi fitur lanjutan termasuk notification system, timeline, dan enhanced UX",
    date: "28 Januari 2025",
    version: "v3.1.0",
    status: "active",
    type: "feature",
    details: [
      "Notification dropdown system",
      "Website timeline feature",
      "Enhanced animations",
      "Improved mobile experience",
      "Advanced API status monitoring",
    ],
  },
  {
    id: "7",
    title: "GraphQL Integration",
    description: "Penambahan dukungan GraphQL untuk query yang lebih fleksibel dan efisien",
    date: "15 Februari 2025",
    version: "v3.2.0",
    status: "upcoming",
    type: "feature",
    details: ["GraphQL endpoint support", "Flexible data querying", "Schema introspection", "Real-time subscriptions"],
  },
  {
    id: "8",
    title: "Enterprise Features",
    description: "Fitur enterprise termasuk API keys, custom rate limits, dan dedicated support",
    date: "Maret 2025",
    version: "v4.0.0",
    status: "upcoming",
    type: "milestone",
    details: [
      "API key authentication",
      "Custom rate limiting",
      "Priority support",
      "Advanced analytics",
      "SLA guarantees",
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "rgb(34, 197, 94)",
        borderColor: "rgba(34, 197, 94, 0.3)",
      }
    case "active":
      return {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        color: "rgb(59, 130, 246)",
        borderColor: "rgba(59, 130, 246, 0.3)",
      }
    case "upcoming":
      return {
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        color: "rgb(234, 179, 8)",
        borderColor: "rgba(234, 179, 8, 0.3)",
      }
    default:
      return {
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        color: "rgb(148, 163, 184)",
        borderColor: "rgba(148, 163, 184, 0.3)",
      }
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "launch":
      return <Sparkles className="h-5 w-5" />
    case "update":
      return <Zap className="h-5 w-5" />
    case "feature":
      return <Code className="h-5 w-5" />
    case "milestone":
      return <Globe className="h-5 w-5" />
    case "maintenance":
      return <Shield className="h-5 w-5" />
    default:
      return <Calendar className="h-5 w-5" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "launch":
      return "from-purple-500/20 to-pink-500/20"
    case "update":
      return "from-blue-500/20 to-cyan-500/20"
    case "feature":
      return "from-green-500/20 to-emerald-500/20"
    case "milestone":
      return "from-yellow-500/20 to-orange-500/20"
    case "maintenance":
      return "from-red-500/20 to-rose-500/20"
    default:
      return "from-gray-500/20 to-slate-500/20"
  }
}

export function TimelineSection() {
  return (
    <section className="container py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Perjalanan <span className="text-purple-400">VGX REST API</span>
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg max-w-3xl mx-auto px-2 sm:px-4">
            Dari peluncuran pertama hingga fitur-fitur terdepan, lihat bagaimana platform kami berkembang untuk melayani
            developer di seluruh dunia
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 opacity-30"></div>

          <div className="space-y-6 sm:space-y-8">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start space-x-4 sm:space-x-8">
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center bg-gradient-to-r ${getTypeColor(event.type)} backdrop-blur-sm`}
                    style={{ borderColor: getStatusColor(event.status).color }}
                  >
                    <div className="text-white">{getTypeIcon(event.type)}</div>
                  </div>

                  {/* Pulse animation for active items */}
                  {event.status === "active" && (
                    <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-500 animate-ping opacity-75"></div>
                  )}
                </div>

                {/* Timeline Content */}
                <Card
                  className={`flex-1 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r ${getTypeColor(event.type)} border-border/50`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base sm:text-lg">{event.title}</CardTitle>
                        {event.version && (
                          <Badge variant="outline" className="text-xs">
                            {event.version}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" style={getStatusColor(event.status)} className="text-xs">
                          {event.status === "completed" ? "Selesai" : event.status === "active" ? "Aktif" : "Mendatang"}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{event.description}</CardDescription>
                  </CardHeader>

                  {event.details && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Fitur & Peningkatan:</h4>
                        <ul className="space-y-1">
                          {event.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                              <span className="text-muted-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>

                        {event.link && (
                          <div className="pt-2">
                            <Button variant="outline" size="sm" className="text-xs bg-transparent" asChild>
                              <a href={event.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Lihat Detail
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                    {timelineEvents.filter((e) => e.status === "completed").length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Milestone Selesai</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {timelineEvents.filter((e) => e.status === "active").length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Sedang Aktif</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                    {timelineEvents.filter((e) => e.status === "upcoming").length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Akan Datang</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-400">{siteConfig.version}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Versi Saat Ini</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Timeline ini menunjukkan perjalanan pengembangan VGX REST API dari awal hingga sekarang
          </p>
        </div>
      </div>
    </section>
  )
}
