import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import type React from "react"
import { siteConfig, getBackgroundStyles } from "@/settings/config"
import { ThemeProvider } from "@/components/theme-provider"

const ensureAbsoluteUrl = (value?: string): string => {
  const raw = value ?? "localhost"
  return raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`
}

const BASE_URL = ensureAbsoluteUrl(siteConfig.api.baseUrl)

export const metadata = {
  title: "VGX REST API's | API Documentation",
  description: "Explore our API endpoints for various services.",
  keywords: "free API, unlimited API, bot development, AI API, anime",
  robots: "index, follow",
  metadataBase: new URL(ensureAbsoluteUrl(siteConfig.api.baseUrl)),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "VGX REST API's | API Documentation",
    description: "Explore our API endpoints for various services.",
    siteName: siteConfig.name,
    images: [
      {
        url: "https://raw.githubusercontent.com/vgxurl/xyz/refs/heads/main/logo.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VGX REST API's | API Documentation",
    description: "Explore our API endpoints for various services.",
    images: ["https://raw.githubusercontent.com/vgxurl/xyz/refs/heads/main/logo.jpg"],
  },
  icons: {
    icon: [{ url: "https://raw.githubusercontent.com/vgxurl/xyz/refs/heads/main/logo.jpg", type: "image/jpeg" }],
    shortcut: [{ url: "https://raw.githubusercontent.com/vgxurl/xyz/refs/heads/main/logo.jpg", type: "image/jpeg" }],
    apple: [
      {
        url: "https://raw.githubusercontent.com/vgxurl/xyz/refs/heads/main/logo.jpg",
        type: "image/jpeg",
        sizes: "any",
      },
    ],
  },
} as const

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
} as const

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const backgroundStyles = getBackgroundStyles()

  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen overflow-x-hidden`}
        style={backgroundStyles}
        data-theme={siteConfig.background.type}
        data-version={siteConfig.version}
        data-api-version={siteConfig.api.defaultVersion}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {siteConfig.background.type === "image" && <div className="fixed inset-0 bg-black/60 -z-10" />}
          <div className="relative z-0 min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
