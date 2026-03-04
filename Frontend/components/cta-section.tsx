"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 }
    )
    const children = el.querySelectorAll("[data-animate]")
    children.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-28 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 noise-overlay" />

      {/* Strong glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.15 180 / 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div
          data-animate
          className="opacity-0 rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-5">
            Ready to Build Trustworthy AI?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 text-pretty">
            TrustLens enhances trust and transparency in machine learning
            systems by providing a comprehensive, automated, and user-friendly
            audit platform. Start auditing your models today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal px-8 h-12 text-base gap-2"
            >
              <Link href="/dashboard/upload">
                Start Auditing Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base"
            >
              Read the Docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
