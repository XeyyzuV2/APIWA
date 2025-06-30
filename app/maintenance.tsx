"use client"

import { useEffect } from "react"
import Link from "next/link"
import { siteConfig } from "@/settings/config"

export default function Maintenance() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const createSparkle = () => {
        const snowContainer = document.getElementById("snow-container")
        if (!snowContainer) return

        const sparkle = document.createElement("div")
        sparkle.classList.add("snowflake")
        sparkle.textContent = "❄️"

        const left = Math.floor(Math.random() * 100)
        const duration = 5 + Math.floor(Math.random() * 10)
        const scale = 0.5 + Math.floor(Math.random() * 15) / 10

        sparkle.style.left = `${left}%`
        sparkle.style.animationDuration = `${duration}s`
        sparkle.style.transform = `scale(${scale})`

        snowContainer.appendChild(sparkle)

        sparkle.addEventListener("animationend", () => {
          sparkle.remove()
        })
      }

      const sparkleInterval = setInterval(createSparkle, 500)

      const maxSnowflakes = 40
      const checkSnowflakesCount = setInterval(() => {
        const snowContainer = document.getElementById("snow-container")
        if (snowContainer && snowContainer.children.length > maxSnowflakes) {
          while (snowContainer.children.length > maxSnowflakes) {
            snowContainer.removeChild(snowContainer.firstChild)
          }
        }
      }, 2000)

      return () => {
        clearInterval(sparkleInterval)
        clearInterval(checkSnowflakesCount)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="bg-white text-gray-900 flex items-center justify-center min-h-screen w-full overflow-hidden fixed inset-0 transition-colors duration-300 p-4">
      <div className="text-center morph-item px-2 sm:px-4 lg:px-6 max-w-sm sm:max-w-md w-full">
        <div className="mx-auto mb-4 relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56">
          <img
            src={siteConfig.maintenance.gifUrl || "/placeholder.svg"}
            alt="Maintenance"
            className="object-contain w-full h-full"
          />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{siteConfig.maintenance.title}</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
          {siteConfig.maintenance.message}
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition morph-button touch-manipulation active:scale-95 text-sm sm:text-base"
          >
            Retry
          </button>
          {siteConfig.maintenance.showHomeLink && (
            <Link
              href="/"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition morph-button touch-manipulation active:scale-95 text-sm sm:text-base inline-block text-center"
            >
              Go Home
            </Link>
          )}
        </div>
      </div>

      <div id="snow-container" className="pointer-events-none"></div>
    </div>
  )
}
