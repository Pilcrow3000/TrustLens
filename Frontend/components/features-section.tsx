"use client"

import { useEffect, useRef } from "react"
import {
  Brain,
  Scale,
  ShieldCheck,
  Activity,
  Gauge,
  FileText,
  BarChart3,
  Users,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Explainability Analysis",
    description:
      "Leverage SHAP-based techniques to understand feature importance and model decision-making at both global and local levels.",
    tag: "XAI",
  },
  {
    icon: Scale,
    title: "Bias & Fairness Detection",
    description:
      "Identify disparate impact and statistical parity violations across protected attributes like gender, race, and age.",
    tag: "Fairness",
  },
  {
    icon: ShieldCheck,
    title: "Robustness Testing",
    description:
      "Evaluate model resilience against adversarial perturbations, noisy inputs, and edge-case scenarios.",
    tag: "Robustness",
  },
  {
    icon: Activity,
    title: "Data Drift Detection",
    description:
      "Monitor distribution shifts between training and production data to identify silent performance degradation.",
    tag: "Drift",
  },
  {
    icon: Gauge,
    title: "Confidence Calibration",
    description:
      "Assess whether predicted probabilities accurately reflect true likelihoods using calibration curves and Brier scores.",
    tag: "Calibration",
  },
  {
    icon: FileText,
    title: "Automated Audit Reports",
    description:
      "Generate comprehensive PDF reports with visualizations, metrics, and actionable recommendations.",
    tag: "Reports",
  },
  {
    icon: BarChart3,
    title: "Unified Trust Score",
    description:
      "A single composite metric aggregating all audit dimensions into an intuitive reliability indicator.",
    tag: "Trust Score",
  },
  {
    icon: Users,
    title: "User-Friendly Interface",
    description:
      "Designed for non-technical users with interactive dashboards and clear, jargon-free visualizations.",
    tag: "UX",
  },
]

export function FeaturesSection() {
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
    <section id="features" className="relative py-28 overflow-hidden" ref={sectionRef}>
      {/* Subtle accent glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.15 180 / 0.4) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            data-animate
            className="opacity-0 text-sm font-medium tracking-widest text-primary uppercase mb-4"
          >
            Core Capabilities
          </p>
          <h2
            data-animate
            className="opacity-0 delay-100 text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            Everything You Need to Trust Your Models
          </h2>
          <p
            data-animate
            className="opacity-0 delay-200 mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Eight integrated audit modules working in concert to deliver a
            complete picture of your model's trustworthiness.
          </p>
        </div>

        {/* Feature grid — bento-style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-animate
              className={`opacity-0 delay-${Math.min((index + 1) * 100, 600)} group relative rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 ${
                index < 2 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[11px] font-mono font-medium text-primary/70 uppercase tracking-wider bg-primary/5 rounded px-2 py-0.5">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
