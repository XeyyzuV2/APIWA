import { NavBar } from "@/components/nav-bar"
import { TimelineSection } from "@/components/timeline-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TimelinePage() {
  return (
    <>
      <NavBar />
      <main className="container py-12 sm:py-16 md:py-24 mt-12 sm:mt-14 md:mt-16 px-2 sm:px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 sm:mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 touch-manipulation active:scale-95">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>

          <TimelineSection />
        </div>
      </main>
    </>
  )
}
