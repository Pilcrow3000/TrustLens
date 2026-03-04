"use client"

import { useEffect, useRef } from "react"

const categories = [
  {
    label: "Language",
    items: ["Python"],
  },
  {
    label: "Machine Learning",
    items: ["Scikit-learn", "PyTorch"],
  },
  {
    label: "Explainability",
    items: ["SHAP"],
  },
  {
    label: "Backend",
    items: ["FastAPI"],
  },
  {
    label: "Frontend",
    items: ["React", "Streamlit"],
  },
  {
    label: "Database",
    items: ["SQLite", "PostgreSQL"],
  },
  {
    label: "Deployment",
    items: ["Docker"],
  },
  {
    label: "Visualization",
    items: ["Matplotlib", "Plotly"],
  },
]

export function TechStackSection() {
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
    <section id="tech" className="relative py-28 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 noise-overlay" />

      {/* Subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.15 180 / 0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            data-animate
            className="opacity-0 text-sm font-medium tracking-widest text-primary uppercase mb-4"
          >
            Technology
          </p>
          <h2
            data-animate
            className="opacity-0 delay-100 text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            Built on Battle-Tested Technologies
          </h2>
          <p
            data-animate
            className="opacity-0 delay-200 mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Industry-standard tools and frameworks powering every layer of the
            TrustLens platform.
          </p>
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <div
              key={cat.label}
              data-animate
              className={`opacity-0 delay-${Math.min((index + 1) * 100, 600)} rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all duration-300`}
            >
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground border border-border"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
