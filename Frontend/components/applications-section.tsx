"use client"

import { useEffect, useRef } from "react"
import {
  GraduationCap,
  Building2,
  Briefcase,
  HeartPulse,
  BookOpen,
} from "lucide-react"

const applications = [
  {
    icon: GraduationCap,
    title: "Academic ML Projects",
    description:
      "Provide students and researchers a structured approach to evaluating and comparing model performance across dimensions.",
  },
  {
    icon: Building2,
    title: "Pre-Deployment Testing",
    description:
      "Validate models against industry standards before they go live, reducing risk and ensuring compliance.",
  },
  {
    icon: Briefcase,
    title: "Recruitment & Finance",
    description:
      "Detect and mitigate bias in high-stakes automated decision systems that impact people's lives and livelihoods.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Validation",
    description:
      "Ensure diagnostic and predictive models meet the highest standards of reliability before clinical deployment.",
  },
  {
    icon: BookOpen,
    title: "Responsible AI Education",
    description:
      "An interactive learning tool that teaches ethical AI practices through hands-on model auditing experience.",
  },
]

export function ApplicationsSection() {
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
    <section id="applications" className="relative py-28 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            data-animate
            className="opacity-0 text-sm font-medium tracking-widest text-primary uppercase mb-4"
          >
            Use Cases
          </p>
          <h2
            data-animate
            className="opacity-0 delay-100 text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            Where TrustLens Makes an Impact
          </h2>
          <p
            data-animate
            className="opacity-0 delay-200 mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            From classrooms to enterprise, TrustLens adapts to wherever
            responsible AI evaluation is needed.
          </p>
        </div>

        {/* Applications grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map((app, index) => (
            <div
              key={app.title}
              data-animate
              className={`opacity-0 delay-${Math.min((index + 1) * 100, 500)} group relative rounded-xl border border-border bg-card p-8 hover:border-primary/30 transition-all duration-300 ${
                index >= 3 ? "lg:col-span-1 md:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5 group-hover:bg-primary/15 transition-colors">
                <app.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {app.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
