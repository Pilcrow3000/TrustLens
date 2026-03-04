"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle, EyeOff, ShieldAlert, TrendingDown } from "lucide-react"

const problems = [
  {
    icon: EyeOff,
    title: "Hidden Bias",
    description:
      "Models trained on biased data can perpetuate and amplify discrimination in critical domains like hiring, lending, and healthcare.",
  },
  {
    icon: AlertTriangle,
    title: "Lack of Explainability",
    description:
      "Black-box models make it impossible to understand why decisions are made, eroding trust among stakeholders and regulators.",
  },
  {
    icon: ShieldAlert,
    title: "Poor Robustness",
    description:
      "Models that perform well in testing may fail catastrophically when exposed to adversarial inputs or unexpected edge cases.",
  },
  {
    icon: TrendingDown,
    title: "Performance Degradation",
    description:
      "Data drift causes model accuracy to decay silently over time, leading to unreliable predictions without warning.",
  },
]

export function ProblemSection() {
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
    <section id="problem" className="relative py-28 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 noise-overlay" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            data-animate
            className="opacity-0 text-sm font-medium tracking-widest text-primary uppercase mb-4"
          >
            The Problem
          </p>
          <h2
            data-animate
            className="opacity-0 delay-100 text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            ML Models Are Deployed Without Proper Scrutiny
          </h2>
          <p
            data-animate
            className="opacity-0 delay-200 mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Most evaluation tools are fragmented and require deep technical
            expertise. There is no unified platform for assessing reliability,
            fairness, and transparency before deployment.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              data-animate
              className={`opacity-0 delay-${(index + 1) * 100} group relative rounded-xl border border-border bg-card p-8 hover:border-primary/30 transition-all duration-300`}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-destructive/10 border border-destructive/20">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
