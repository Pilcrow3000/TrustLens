"use client"

import { useEffect, useRef } from "react"
import {
  Zap,
  BarChart3,
  Download,
  Lightbulb,
  ShieldCheck,
  Target,
} from "lucide-react"

const outcomes = [
  {
    icon: Zap,
    title: "Fully Functional AI Audit Platform",
    description: "End-to-end solution from model upload to comprehensive trust evaluation.",
  },
  {
    icon: BarChart3,
    title: "Automated Model Evaluation",
    description: "No manual intervention — upload a model and receive a full audit automatically.",
  },
  {
    icon: Target,
    title: "Interactive Analysis Dashboard",
    description: "Rich visualizations and metrics displayed through intuitive, explorable interfaces.",
  },
  {
    icon: Download,
    title: "Downloadable Audit Reports",
    description: "Generate professional PDF reports with all findings, charts, and recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Unified Trust Score",
    description: "A single, interpretable metric indicating overall model reliability and trustworthiness.",
  },
  {
    icon: Lightbulb,
    title: "Responsible AI Awareness",
    description: "Promotes ethical practices and transparency in AI development and deployment.",
  },
]

export function OutcomesSection() {
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
      { threshold: 0.05 }
    )
    const children = el.querySelectorAll("[data-animate]")
    children.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-28 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            data-animate
            className="opacity-0 text-sm font-medium tracking-widest text-primary uppercase mb-4"
          >
            Expected Outcomes
          </p>
          <h2
            data-animate
            className="opacity-0 delay-100 text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            What TrustLens Delivers
          </h2>
          <p
            data-animate
            className="opacity-0 delay-200 mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Tangible results that make a real difference in how you develop,
            evaluate, and deploy machine learning models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome.title}
              data-animate
              className={`opacity-0 delay-${Math.min((index + 1) * 100, 600)} flex items-start gap-4 rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                <outcome.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {outcome.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
