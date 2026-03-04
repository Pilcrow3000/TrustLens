"use client"

import { useState } from "react"
import {
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Filter,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const historyItems = [
  {
    id: "AUD-024",
    model: "credit_risk_v3.pkl",
    framework: "Scikit-learn",
    score: 92,
    status: "Passed",
    date: "Mar 4, 2026",
    time: "14:32 UTC",
    duration: "3m 42s",
    modules: ["Explainability", "Fairness", "Robustness", "Drift", "Calibration"],
    dimensions: { Explainability: 94, Fairness: 95, Robustness: 88, Drift: 91, Calibration: 92 },
  },
  {
    id: "AUD-023",
    model: "fraud_detector_v2.pt",
    framework: "PyTorch",
    score: 78,
    status: "Warning",
    date: "Mar 3, 2026",
    time: "10:15 UTC",
    duration: "5m 18s",
    modules: ["Explainability", "Fairness", "Robustness", "Drift", "Calibration"],
    dimensions: { Explainability: 80, Fairness: 72, Robustness: 81, Drift: 76, Calibration: 82 },
  },
  {
    id: "AUD-022",
    model: "sentiment_analyzer.onnx",
    framework: "ONNX",
    score: 85,
    status: "Passed",
    date: "Mar 2, 2026",
    time: "16:45 UTC",
    duration: "4m 12s",
    modules: ["Explainability", "Fairness", "Robustness", "Calibration"],
    dimensions: { Explainability: 90, Fairness: 88, Robustness: 79, Calibration: 84 },
  },
  {
    id: "AUD-021",
    model: "recommender_sys.pkl",
    framework: "Scikit-learn",
    score: 64,
    status: "Failed",
    date: "Mar 1, 2026",
    time: "09:30 UTC",
    duration: "6m 03s",
    modules: ["Explainability", "Fairness", "Robustness", "Drift", "Calibration"],
    dimensions: { Explainability: 68, Fairness: 55, Robustness: 70, Drift: 60, Calibration: 65 },
  },
  {
    id: "AUD-020",
    model: "image_classifier.h5",
    framework: "Keras",
    score: 90,
    status: "Passed",
    date: "Feb 28, 2026",
    time: "11:22 UTC",
    duration: "4m 56s",
    modules: ["Explainability", "Robustness", "Calibration"],
    dimensions: { Explainability: 92, Robustness: 87, Calibration: 91 },
  },
  {
    id: "AUD-019",
    model: "churn_predictor.pkl",
    framework: "Scikit-learn",
    score: 81,
    status: "Passed",
    date: "Feb 27, 2026",
    time: "15:08 UTC",
    duration: "3m 28s",
    modules: ["Explainability", "Fairness", "Drift"],
    dimensions: { Explainability: 85, Fairness: 78, Drift: 80 },
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
      return "bg-secondary text-secondary-foreground"
  }
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-primary"
  if (score >= 70) return "text-chart-4"
  return "text-destructive"
}

export function HistoryContent() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary gap-2">
          <Filter className="w-3.5 h-3.5" />
          All Statuses
        </Button>
        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Date Range
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">
          Showing {historyItems.length} of 24 audits
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-3">
        {historyItems.map((item) => {
          const isExpanded = expandedId === item.id
          return (
            <Card key={item.id} className="bg-card border-border overflow-hidden">
              <button
                className="w-full text-left"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="w-14 h-14 rounded-xl bg-secondary/30 border border-border flex flex-col items-center justify-center flex-shrink-0">
                      <span className={`text-lg font-bold font-mono leading-none ${getScoreColor(item.score)}`}>
                        {item.score}
                      </span>
                      <span className="text-[9px] text-muted-foreground mt-0.5">score</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium font-mono text-foreground truncate">
                          {item.model}
                        </span>
                        <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-border text-muted-foreground flex-shrink-0">
                          {item.framework}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-mono">{item.id}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.date} at {item.time}
                        </span>
                        <span>Duration: {item.duration}</span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Modules */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                        Audit Modules
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.modules.map((mod) => (
                          <Badge key={mod} variant="outline" className="text-xs border-primary/20 text-primary">
                            {mod}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Scores */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                        Dimension Scores
                      </p>
                      <div className="flex flex-col gap-2">
                        {Object.entries(item.dimensions).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{key}</span>
                            <Progress value={val} className="h-1.5 flex-1" />
                            <span className={`text-xs font-mono ${getScoreColor(val)}`}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-secondary gap-1 text-xs">
                      View Full Report
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
