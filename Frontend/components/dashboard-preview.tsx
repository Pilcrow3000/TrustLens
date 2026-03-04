"use client"

import { useEffect, useRef } from "react"
import { Shield, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

export function DashboardPreview() {
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

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            data-animate
            className="opacity-0 text-sm font-medium tracking-widest text-primary uppercase mb-4"
          >
            Dashboard Preview
          </p>
          <h2
            data-animate
            className="opacity-0 delay-100 text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            Your Audit at a Glance
          </h2>
          <p
            data-animate
            className="opacity-0 delay-200 mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Interactive dashboards transform complex audit data into clear,
            actionable insights.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div
          data-animate
          className="opacity-0 delay-300 rounded-2xl border border-border bg-card overflow-hidden glow-teal"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
            <span className="w-3 h-3 rounded-full bg-destructive/50" />
            <span className="w-3 h-3 rounded-full bg-chart-4/50" />
            <span className="w-3 h-3 rounded-full bg-primary/50" />
            <span className="ml-4 text-xs font-mono text-muted-foreground">
              trustlens / audit-dashboard
            </span>
          </div>

          <div className="p-6 md:p-8">
            {/* Top stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Trust Score",
                  value: "87.4",
                  icon: Shield,
                  color: "text-primary",
                  bgColor: "bg-primary/10",
                  suffix: "/100",
                },
                {
                  label: "Fairness",
                  value: "92.1",
                  icon: CheckCircle2,
                  color: "text-chart-4",
                  bgColor: "bg-chart-4/10",
                  suffix: "%",
                },
                {
                  label: "Robustness",
                  value: "78.6",
                  icon: TrendingUp,
                  color: "text-chart-2",
                  bgColor: "bg-chart-2/10",
                  suffix: "%",
                },
                {
                  label: "Drift Risk",
                  value: "Low",
                  icon: AlertTriangle,
                  color: "text-chart-4",
                  bgColor: "bg-chart-4/10",
                  suffix: "",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-secondary/20 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {stat.value}
                    <span className="text-sm font-normal text-muted-foreground">
                      {stat.suffix}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Chart area mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature importance chart (large) */}
              <div className="md:col-span-2 rounded-lg border border-border bg-secondary/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-foreground">SHAP Feature Importance</h4>
                  <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">GLOBAL</span>
                </div>
                {/* Horizontal bar chart mockup */}
                <div className="flex flex-col gap-3">
                  {[
                    { label: "income", width: "92%" },
                    { label: "credit_score", width: "78%" },
                    { label: "employment_years", width: "65%" },
                    { label: "debt_ratio", width: "52%" },
                    { label: "age", width: "38%" },
                    { label: "num_accounts", width: "24%" },
                    { label: "education", width: "15%" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-32 text-right flex-shrink-0 truncate">
                        {bar.label}
                      </span>
                      <div className="flex-1 h-5 bg-secondary/60 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-sm transition-all duration-1000"
                          style={{ width: bar.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — smaller charts */}
              <div className="flex flex-col gap-4">
                {/* Calibration indicator */}
                <div className="rounded-lg border border-border bg-secondary/20 p-5 flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-3">Calibration</h4>
                  <div className="flex items-end justify-between gap-1 h-24">
                    {[40, 55, 65, 72, 80, 85, 78, 90, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-primary/40 hover:bg-primary/60 transition-colors"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Brier Score: 0.082</p>
                </div>

                {/* Bias summary */}
                <div className="rounded-lg border border-border bg-secondary/20 p-5 flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-3">Bias Analysis</h4>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { attr: "Gender", status: "Pass", ok: true },
                      { attr: "Age", status: "Warning", ok: false },
                      { attr: "Race", status: "Pass", ok: true },
                    ].map((item) => (
                      <div key={item.attr} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.attr}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            item.ok
                              ? "bg-primary/10 text-primary"
                              : "bg-chart-4/10 text-chart-4"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
