"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/settings/config"

export default function NotFound() {
  useEffect(() => {
    const createSparkle = () => {
      const snowContainer = document.getElementById("snow-container")
      if (!snowContainer) return

      const sparkle = document.createElement("div")
      sparkle.classList.add("snowflake")
      sparkle.textContent = "✨"

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

    const timeoutId = setTimeout(() => {
      const sparkleInterval = setInterval(createSparkle, 300)

      return () => {
        clearInterval(sparkleInterval)
        clearTimeout(timeoutId)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="bg-white text-gray-900 flex items-center justify-center min-h-screen w-full overflow-hidden fixed inset-0 transition-colors duration-300 p-4">
      <div className="text-center morph-item px-2 sm:px-4 lg:px-6 max-w-sm sm:max-w-md w-full">
        <div className="mx-auto mb-4 relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56">
          <Image
            src={siteConfig.notFound.gifUrl || "/placeholder.svg"}
            alt="Confused Anime Girl"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{siteConfig.notFound.title}</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
          {siteConfig.notFound.message}
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition morph-button touch-manipulation active:scale-95 text-sm sm:text-base"
          >
            Retry
          </button>
          <Link
            href="/"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition morph-button touch-manipulation active:scale-95 text-sm sm:text-base inline-block text-center"
          >
            Go Home
          </Link>
        </div>
      </div>

      <div id="snow-container" className="pointer-events-none"></div>
    </div>
  )
}
