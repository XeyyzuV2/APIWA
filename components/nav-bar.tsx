"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GithubIcon, Menu, X } from "lucide-react"
import { siteConfig } from "@/settings/config"
import { Logo } from "@/components/logo"
import { NotificationDropdown } from "@/components/notification-dropdown"

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 md:h-16 items-center justify-between px-2 sm:px-4 max-w-full">
        <Link href="/" className="flex items-center space-x-1 sm:space-x-2 min-w-0" onClick={closeMenu}>
          {siteConfig.logo.src ? (
            <>
              <Logo
                width={siteConfig.logo.width || 28}
                height={siteConfig.logo.height || 28}
                className="flex-shrink-0"
              />
              <span className="text-sm sm:text-base md:text-xl font-bold truncate">{siteConfig.name}</span>
            </>
          ) : (
            <span className="text-sm sm:text-base md:text-xl font-bold truncate">{siteConfig.name}</span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 md:gap-4">
          <Link href="/docs" className="text-xs md:text-sm font-medium hover:underline">
            Documentation
          </Link>
          <NotificationDropdown />
          <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 bg-transparent">
              <GithubIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <NotificationDropdown />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 touch-manipulation active:scale-95 bg-transparent"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <Menu className="h-4 w-4 transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        <nav className="container px-2 sm:px-4 py-4 space-y-4">
          <Link
            href="/docs"
            className="block text-sm font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted touch-manipulation active:scale-95"
            onClick={closeMenu}
          >
            Documentation
          </Link>

          <div className="flex items-center justify-between py-2 px-3">
            <span className="text-sm font-medium text-muted-foreground">Connect</span>
            <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 touch-manipulation active:scale-95 bg-transparent"
              >
                <GithubIcon className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </Link>
          </div>

          <div className="border-t pt-4">
            <div className="text-xs text-muted-foreground px-3">
              <div className="flex items-center justify-between">
                <span>Version {siteConfig.version}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    siteConfig.status === "online" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {siteConfig.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
