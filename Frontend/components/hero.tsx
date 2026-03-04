"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Radial glow from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.15 180 / 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Floating accent line */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div ref={containerRef} className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center">
        {/* Eyebrow badge */}
        <div
          data-animate
          className="opacity-0 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-medium tracking-wide text-primary uppercase">
            ML Model Auditing Platform
          </span>
        </div>

        {/* Main headline */}
        <h1
          data-animate
          className="opacity-0 delay-100 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-balance"
        >
          <span className="text-foreground">Audit Your ML</span>
          <br />
          <span className="text-foreground">Models with </span>
          <span className="text-primary">Confidence</span>
        </h1>

        {/* Subheadline */}
        <p
          data-animate
          className="opacity-0 delay-200 mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty"
        >
          TrustLens delivers automated explainability, fairness, robustness, and
          drift analysis in a single unified platform. Know your model before
          you deploy it.
        </p>

        {/* CTAs */}
        <div
          data-animate
          className="opacity-0 delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal px-8 h-12 text-base gap-2"
          >
            <Link href="/dashboard">
              Start Auditing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base gap-2"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>

        {/* Trust metrics strip */}
        <div
          data-animate
          className="opacity-0 delay-500 mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden"
        >
          {[
            { value: "5", label: "Audit Dimensions" },
            { value: "1", label: "Unified Trust Score" },
            { value: "PDF", label: "Auto-Generated Reports" },
            { value: "0", label: "Technical Expertise Needed" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card px-6 py-5 flex flex-col items-center"
            >
              <span className="text-2xl md:text-3xl font-bold text-primary font-mono">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
