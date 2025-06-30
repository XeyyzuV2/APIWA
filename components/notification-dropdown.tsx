"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Sparkles, Clock, ExternalLink } from "lucide-react"
import { siteConfig } from "@/settings/config"
import Link from "next/link"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "feature":
      return <Sparkles className="h-4 w-4 text-purple-500" />
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

const getNotificationBadgeStyle = (type: string): React.CSSProperties => {
  switch (type) {
    case "info":
      return {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        color: "rgb(59, 130, 246)",
        borderColor: "rgba(59, 130, 246, 0.3)",
      }
    case "warning":
      return {
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        color: "rgb(234, 179, 8)",
        borderColor: "rgba(234, 179, 8, 0.3)",
      }
    case "success":
      return {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "rgb(34, 197, 94)",
        borderColor: "rgba(34, 197, 94, 0.3)",
      }
    case "error":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "rgb(239, 68, 68)",
        borderColor: "rgba(239, 68, 68, 0.3)",
      }
    case "feature":
      return {
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        color: "rgb(168, 85, 247)",
        borderColor: "rgba(168, 85, 247, 0.3)",
      }
    default:
      return {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        color: "rgb(59, 130, 246)",
        borderColor: "rgba(59, 130, 246, 0.3)",
      }
  }
}

const getTypeGradient = (type: string) => {
  switch (type) {
    case "info":
      return "from-blue-500/20 to-blue-600/5"
    case "warning":
      return "from-yellow-500/20 to-yellow-600/5"
    case "success":
      return "from-green-500/20 to-green-600/5"
    case "error":
      return "from-red-500/20 to-red-600/5"
    case "feature":
      return "from-purple-500/20 to-purple-600/5"
    default:
      return "from-blue-500/20 to-blue-600/5"
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const newNotificationsCount = siteConfig.announcements.filter((a) => a.isNew).length

  useEffect(() => {
    if (newNotificationsCount > 0) {
      setHasNewNotifications(true)
      const timer = setTimeout(() => setHasNewNotifications(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [newNotificationsCount])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 md:h-9 md:w-9 relative transition-all duration-300 hover:scale-105 ${
            hasNewNotifications ? "animate-pulse border-purple-400/50 bg-purple-500/5" : ""
          }`}
        >
          <Bell
            className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-300 ${
              hasNewNotifications ? "text-purple-500 animate-bounce" : ""
            }`}
          />
          {newNotificationsCount > 0 && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-white">
                  {newNotificationsCount > 9 ? "9+" : newNotificationsCount}
                </span>
              </div>
              <div className="absolute h-5 w-5 rounded-full bg-red-500 animate-ping opacity-75"></div>
            </div>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 max-w-[calc(100vw-2rem)] border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20">
              <Bell className="h-4 w-4 text-purple-500" />
            </div>
            <span className="font-semibold text-base">Announcements</span>
          </div>
          {newNotificationsCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs font-medium animate-pulse"
              style={{
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                color: "rgb(168, 85, 247)",
                borderColor: "rgba(168, 85, 247, 0.3)",
              }}
            >
              {newNotificationsCount} new
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-4" />

        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {siteConfig.announcements.length === 0 ? (
            <DropdownMenuItem disabled className="p-4 flex-col items-center justify-center min-h-[100px]">
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <div className="p-3 rounded-full bg-muted/50">
                  <Bell className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">No announcements</span>
                <span className="text-xs text-center">We'll notify you when there's something new!</span>
              </div>
            </DropdownMenuItem>
          ) : (
            siteConfig.announcements.map((announcement, index) => (
              <DropdownMenuItem
                key={announcement.id}
                className={`flex-col items-start space-y-2 p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md bg-gradient-to-r ${getTypeGradient(announcement.type)} border border-transparent hover:border-border/50`}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(announcement.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between w-full mb-1">
                      <h4 className="font-semibold text-sm text-foreground leading-tight">{announcement.title}</h4>
                      {announcement.isNew && (
                        <Badge
                          variant="outline"
                          className="text-xs ml-2 animate-pulse flex-shrink-0"
                          style={getNotificationBadgeStyle(announcement.type)}
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{announcement.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(announcement.date)}</span>
                      </div>
                      {announcement.link && (
                        <Link
                          href={announcement.link}
                          className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Learn more</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="mx-4" />

        <div className="p-4 pt-2">
          <div className="text-xs text-muted-foreground text-center">
            Stay updated with the latest API news and updates
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
