"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/settings/config"
import * as Icons from "lucide-react"

export function WhyChooseSection() {
  return (
    <section className="container py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Why Choose <span className="text-purple-400">VGX REST API</span>?
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg max-w-3xl mx-auto px-2 sm:px-4">
            Built for developers who demand reliability, speed, and simplicity in their API integrations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
          {siteConfig.features.map((feature, index) => {
            const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.ComponentType<{
              className?: string
            }>

            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-purple-400/50 bg-card/50 backdrop-blur-sm touch-manipulation active:scale-95"
              >
                <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-sm sm:text-base md:text-lg font-semibold group-hover:text-purple-400 transition-colors leading-tight">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 md:mt-12 text-center px-4">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 rounded-full px-4 md:px-6 py-2 md:py-3 max-w-full">
            <Icons.Zap className="h-4 w-4 md:h-5 md:w-5 text-purple-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center break-words">
              Join thousands of developers already using VGX REST API
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
