"use client"

import { useEffect, useRef } from "react"
import { ClipboardList, Cpu, Layers, Layout, FileOutput, TestTubeDiagonal } from "lucide-react"

const phases = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Requirement Analysis & Design",
    items: [
      "Study existing model evaluation techniques",
      "Identify suitable datasets and model formats",
      "Design system architecture and workflow",
    ],
  },
  {
    icon: Cpu,
    number: "02",
    title: "Core Engine Development",
    items: [
      "Implement explainability using SHAP",
      "Develop bias and fairness analysis",
      "Build robustness and adversarial testing",
      "Develop drift detection algorithms",
      "Implement confidence calibration evaluation",
    ],
  },
  {
    icon: Layers,
    number: "03",
    title: "Backend & Integration",
    items: [
      "Develop REST APIs using FastAPI",
      "Integrate all audit modules",
      "Implement file upload and validation",
    ],
  },
  {
    icon: Layout,
    number: "04",
    title: "Frontend & Visualization",
    items: [
      "Design user interface with modern frameworks",
      "Develop interactive audit dashboards",
      "Display metrics and rich visualizations",
    ],
  },
  {
    icon: FileOutput,
    number: "05",
    title: "Report Generation & Deployment",
    items: [
      "Implement automated PDF report generation",
      "Containerize application using Docker",
      "Deploy on cloud or local server",
    ],
  },
  {
    icon: TestTubeDiagonal,
    number: "06",
    title: "Testing & Documentation",
    items: [
      "System testing with multiple datasets",
      "Validate accuracy and performance",
      "Prepare technical documentation and user manual",
    ],
  },
]

export function WorkflowSection() {
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
    <section id="workflow" className="relative py-28 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            data-animate
            className="opacity-0 text-sm font-medium tracking-widest text-primary uppercase mb-4"
          >
            Development Roadmap
          </p>
          <h2
            data-animate
            className="opacity-0 delay-100 text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            How TrustLens Is Built
          </h2>
          <p
            data-animate
            className="opacity-0 delay-200 mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            A structured, modular development approach across six phases ensures
            thoroughness and reliability.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {phases.map((phase, index) => (
            <div
              key={phase.number}
              data-animate
              className={`opacity-0 delay-${Math.min((index + 1) * 100, 600)} relative rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300`}
            >
              {/* Phase number */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 rounded-md px-2.5 py-1 border border-primary/20">
                  {phase.number}
                </span>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
                  <phase.icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <h3 className="text-base font-semibold text-foreground mb-3">
                {phase.title}
              </h3>

              <ul className="flex flex-col gap-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
