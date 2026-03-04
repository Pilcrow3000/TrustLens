"use client"

import Link from "next/link"
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Upload,
  ArrowRight,
  Activity,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const stats = [
  {
    label: "Total Audits",
    value: "24",
    change: "+3 this week",
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Avg Trust Score",
    value: "87.4",
    change: "+2.1 from last month",
    icon: Shield,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    label: "Models Uploaded",
    value: "18",
    change: "5 pending review",
    icon: Upload,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    label: "Active Alerts",
    value: "2",
    change: "1 critical, 1 warning",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
]

const recentAudits = [
  {
    model: "credit_risk_v3.pkl",
    score: 92,
    status: "Passed",
    date: "2 hours ago",
    dimensions: { fairness: 95, robustness: 88, explainability: 94 },
  },
  {
    model: "fraud_detector_v2.pt",
    score: 78,
    status: "Warning",
    date: "5 hours ago",
    dimensions: { fairness: 72, robustness: 81, explainability: 80 },
  },
  {
    model: "sentiment_analyzer.onnx",
    score: 85,
    status: "Passed",
    date: "1 day ago",
    dimensions: { fairness: 88, robustness: 79, explainability: 90 },
  },
  {
    model: "recommender_sys.pkl",
    score: 64,
    status: "Failed",
    date: "2 days ago",
    dimensions: { fairness: 55, robustness: 70, explainability: 68 },
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Passed":
      return "bg-primary/10 text-primary border-primary/20"
    case "Warning":
      return "bg-chart-4/10 text-chart-4 border-chart-4/20"
    case "Failed":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-secondary text-secondary-foreground border-border"
  }
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-primary"
  if (score >= 70) return "text-chart-4"
  return "text-destructive"
}

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold font-mono text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Audits */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Recent Audits</CardTitle>
                <CardDescription>Latest model evaluations and trust scores</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/dashboard/history">
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentAudits.map((audit) => (
                <div
                  key={audit.model}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border border-border hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium font-mono text-foreground truncate">
                        {audit.model}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${getStatusColor(audit.status)}`}
                      >
                        {audit.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      {Object.entries(audit.dimensions).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground capitalize">{key}</span>
                          <Progress value={val} className="w-16 h-1.5" />
                          <span className="text-[10px] font-mono text-muted-foreground">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-2xl font-bold font-mono ${getScoreColor(audit.score)}`}>
                      {audit.score}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="w-2.5 h-2.5" />
                      {audit.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions + Audit Dimensions */}
        <div className="flex flex-col gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 justify-start gap-2">
                <Link href="/dashboard/upload">
                  <Upload className="w-4 h-4" />
                  Upload New Model
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2 border-border text-foreground hover:bg-secondary">
                <Link href="/dashboard/results">
                  <ClipboardCheck className="w-4 h-4" />
                  View Results
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2 border-border text-foreground hover:bg-secondary">
                <Link href="/dashboard/reports">
                  <TrendingUp className="w-4 h-4" />
                  Generate Report
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Audit Dimensions</CardTitle>
              <CardDescription>Average scores across all models</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                { label: "Explainability", value: 91, icon: CheckCircle2 },
                { label: "Fairness", value: 87, icon: Shield },
                { label: "Robustness", value: 79, icon: TrendingUp },
                { label: "Drift Detection", value: 83, icon: Activity },
                { label: "Calibration", value: 88, icon: CheckCircle2 },
              ].map((dim) => (
                <div key={dim.label} className="flex items-center gap-3">
                  <dim.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{dim.label}</span>
                      <span className={`text-xs font-mono font-medium ${getScoreColor(dim.value)}`}>
                        {dim.value}%
                      </span>
                    </div>
                    <Progress value={dim.value} className="h-1.5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ClipboardCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}
