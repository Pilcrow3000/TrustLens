"use client"

import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
  Eye,
  Download,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const trustScore = 87.4
const modelName = "credit_risk_v3.pkl"
const auditDate = "Mar 4, 2026 — 14:32 UTC"

const dimensions = [
  {
    name: "Explainability",
    score: 91,
    status: "Passed",
    icon: Eye,
    description: "SHAP analysis reveals well-distributed feature importance with no single-feature dominance.",
    details: [
      { label: "Top Feature", value: "income (0.34)" },
      { label: "Feature Coverage", value: "94%" },
      { label: "SHAP Consistency", value: "High" },
    ],
  },
  {
    name: "Fairness",
    score: 87,
    status: "Passed",
    icon: Shield,
    description: "Model shows equitable outcomes across protected attributes with minor age-group variance.",
    details: [
      { label: "Gender Parity", value: "0.97" },
      { label: "Age Disparity", value: "0.12" },
      { label: "Overall Bias", value: "Low" },
    ],
  },
  {
    name: "Robustness",
    score: 79,
    status: "Warning",
    icon: TrendingUp,
    description: "Model maintains accuracy under moderate perturbations but degrades with adversarial noise.",
    details: [
      { label: "Noise Tolerance", value: "82%" },
      { label: "Adversarial AUC", value: "0.71" },
      { label: "Stability Index", value: "Medium" },
    ],
  },
  {
    name: "Drift Detection",
    score: 83,
    status: "Passed",
    icon: Activity,
    description: "No significant data drift detected. Feature distributions remain stable over the evaluation window.",
    details: [
      { label: "PSI Score", value: "0.04" },
      { label: "KS Statistic", value: "0.06" },
      { label: "Drift Risk", value: "Low" },
    ],
  },
  {
    name: "Calibration",
    score: 88,
    status: "Passed",
    icon: BarChart3,
    description: "Predicted probabilities are well-calibrated with a low Brier score, suitable for decision thresholding.",
    details: [
      { label: "Brier Score", value: "0.082" },
      { label: "ECE", value: "0.031" },
      { label: "Reliability", value: "High" },
    ],
  },
]

const shapFeatures = [
  { label: "income", width: 92 },
  { label: "credit_score", width: 78 },
  { label: "employment_years", width: 65 },
  { label: "debt_ratio", width: 52 },
  { label: "age", width: 38 },
  { label: "num_accounts", width: 24 },
  { label: "education", width: 15 },
]

function getScoreColor(score: number) {
  if (score >= 85) return "text-primary"
  if (score >= 70) return "text-chart-4"
  return "text-destructive"
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Passed":
      return "bg-primary/10 text-primary border-primary/20"
    case "Warning":
      return "bg-chart-4/10 text-chart-4 border-chart-4/20"
    case "Failed":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export function ResultsContent() {
  return (
    <div className="flex flex-col gap-8">
      {/* Trust Score Header */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <CardContent className="relative pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-teal-sm">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-semibold text-foreground">Overall Trust Score</h2>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                      Passed
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{modelName}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{auditDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-6xl font-bold font-mono ${getScoreColor(trustScore)}`}>
                  {trustScore}
                </p>
                <p className="text-xs text-muted-foreground mt-1">out of 100</p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Dimension Scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {dimensions.map((dim) => (
          <Card key={dim.name} className="bg-card border-border">
            <CardContent className="pt-0 text-center">
              <div className="w-10 h-10 rounded-lg bg-secondary/40 flex items-center justify-center mx-auto mb-2">
                <dim.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className={`text-2xl font-bold font-mono ${getScoreColor(dim.score)}`}>
                {dim.score}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{dim.name}</p>
              <Badge variant="outline" className={`mt-2 text-[10px] ${getStatusBadge(dim.status)}`}>
                {dim.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-secondary/40 border border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="explainability">Explainability</TabsTrigger>
          <TabsTrigger value="fairness">Fairness</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dimensions.map((dim) => (
              <Card key={dim.name} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground text-base flex items-center gap-2">
                      <dim.icon className="w-4 h-4 text-muted-foreground" />
                      {dim.name}
                    </CardTitle>
                    <Badge variant="outline" className={`text-[10px] ${getStatusBadge(dim.status)}`}>
                      {dim.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Progress value={dim.score} className="h-2 flex-1" />
                    <span className={`text-sm font-bold font-mono ${getScoreColor(dim.score)}`}>
                      {dim.score}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {dim.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {dim.details.map((d) => (
                      <div key={d.label} className="p-2 rounded-md bg-secondary/20 border border-border">
                        <p className="text-[10px] text-muted-foreground">{d.label}</p>
                        <p className="text-xs font-medium font-mono text-foreground mt-0.5">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="explainability" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">SHAP Feature Importance</CardTitle>
              <CardDescription>
                Global feature importance computed using SHAP (SHapley Additive exPlanations)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {shapFeatures.map((feature) => (
                  <div key={feature.label} className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground w-36 text-right flex-shrink-0">
                      {feature.label}
                    </span>
                    <div className="flex-1 h-7 bg-secondary/40 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-primary/50 rounded-sm flex items-center justify-end pr-2"
                        style={{ width: `${feature.width}%` }}
                      >
                        <span className="text-[10px] font-mono text-foreground">
                          {(feature.width / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fairness" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Bias & Fairness Analysis</CardTitle>
              <CardDescription>
                Analysis of model predictions across protected attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { attr: "Gender", parity: 0.97, status: "Pass", detail: "Near-perfect demographic parity across gender groups." },
                  { attr: "Age Group", parity: 0.88, status: "Warning", detail: "Slight disparity between 18-25 and 45+ age brackets." },
                  { attr: "Ethnicity", parity: 0.95, status: "Pass", detail: "Equalized odds maintained across all ethnic categories." },
                ].map((item) => (
                  <div key={item.attr} className="p-4 rounded-lg bg-secondary/20 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">{item.attr}</h4>
                      <Badge variant="outline" className={`text-[10px] ${item.status === "Pass" ? "bg-primary/10 text-primary border-primary/20" : "bg-chart-4/10 text-chart-4 border-chart-4/20"}`}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={item.parity * 100} className="h-2 flex-1" />
                      <span className="text-xs font-mono text-foreground">{item.parity}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
        <Button variant="outline" className="border-border text-foreground hover:bg-secondary gap-2">
          <BarChart3 className="w-4 h-4" />
          Compare with Previous
        </Button>
      </div>
    </div>
  )
}
