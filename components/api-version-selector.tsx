"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap, Shield } from "lucide-react"
import { siteConfig } from "@/settings/config"

interface ApiVersionSelectorProps {
  selectedVersion: string
  onVersionChange: (version: string) => void
}

export function ApiVersionSelector({ selectedVersion, onVersionChange }: ApiVersionSelectorProps) {
  const versionFeatures = {
    v1: {
      title: "Version 1",
      description: "Stable and reliable",
      features: ["Basic endpoints", "Standard rate limits", "JSON responses"],
      badge: "Stable",
      badgeStyle: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "rgb(34, 197, 94)",
        borderColor: "rgba(34, 197, 94, 0.3)",
      },
    },
    v2: {
      title: "Version 2",
      description: "Enhanced performance",
      features: ["All v1 features", "Improved caching", "Better error handling", "Enhanced security"],
      badge: "Recommended",
      badgeStyle: {
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        color: "rgb(168, 85, 247)",
        borderColor: "rgba(168, 85, 247, 0.3)",
      },
    },
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Choose Your API Version</h3>
        <p className="text-muted-foreground text-sm">Select the API version that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {siteConfig.api.versions.map((version) => {
          const versionInfo = versionFeatures[version as keyof typeof versionFeatures]
          const isSelected = selectedVersion === version

          return (
            <Card
              key={version}
              className={`cursor-pointer transition-all duration-200 touch-manipulation ${
                isSelected
                  ? "ring-2 ring-purple-400 border-purple-400/50 bg-purple-500/5"
                  : "hover:border-purple-400/30 hover:shadow-md active:scale-95"
              }`}
              onClick={() => onVersionChange(version)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{versionInfo.title}</span>
                    {isSelected && <CheckCircle className="h-5 w-5 text-purple-400" />}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs" style={versionInfo.badgeStyle}>
                    {versionInfo.badge}
                  </Badge>
                </div>
                <CardDescription>{versionInfo.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {versionInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>
                        Rate Limit: {siteConfig.api.rateLimit.limit}/{siteConfig.api.rateLimit.window}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center mt-6">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onVersionChange(selectedVersion === "v1" ? "v2" : "v1")}
        >
          Switch to {selectedVersion === "v1" ? "v2" : "v1"}
        </Button>
      </div>
    </div>
  )
}
