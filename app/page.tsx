import { NavBar } from "@/components/nav-bar"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col">
        <HeroSection />
      </main>
    </>
  )
}
