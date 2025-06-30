"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/settings/config"
import { WhyChooseSection } from "@/components/why-choose-section"
import Link from "next/link"

export function HeroSection() {
  return (
    <>
      <section className="relative flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-8 sm:py-12 md:py-24">
        <style jsx>{`
          .text-gradient-fallback {
            color: #c084fc;
          }
        `}</style>
        <div className="container relative px-2 sm:px-4 lg:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="relative mb-8 sm:mb-12">
              <div className="relative inline-block text-left">
                <div className="absolute -top-6 sm:-top-8 right-0 transform translate-x-1/2">
                  <Badge
                    className="rounded-full px-2 sm:px-4 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(209, 213, 219, 0.9)",
                      color: "rgb(31, 41, 55)",
                    }}
                  >
                    {siteConfig.version}
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  <span
                    className="gradient-text block"
                    style={{
                      WebkitTextFillColor: "#c084fc",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "#c084fc",
                    }}
                  >
                    {siteConfig.name}
                  </span>
                </h1>

                <div className="absolute -bottom-6 sm:-bottom-8 left-0 transform -translate-x-1/2">
                  <Badge
                    className="rounded-full px-2 sm:px-4 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        siteConfig.status === "online" ? "rgba(74, 222, 128, 0.9)" : "rgba(248, 113, 113, 0.9)",
                      color: "white",
                    }}
                  >
                    {siteConfig.status === "online" ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="mb-6 sm:mb-8 md:mb-12 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              {siteConfig.description}
            </p>

            <div className="flex justify-center">
              <Link href="/docs">
                <Button
                  size="lg"
                  className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base rounded-full bg-white text-black hover:bg-white/90 transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseSection />
    </>
  )
}
