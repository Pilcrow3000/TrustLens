"use client"

import {
  FileText,
  Download,
  Share2,
  Eye,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Search,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const reports = [
  {
    id: "RPT-001",
    model: "credit_risk_v3.pkl",
    score: 92,
    status: "Complete",
    date: "Mar 4, 2026",
    pages: 24,
    format: "PDF",
  },
  {
    id: "RPT-002",
    model: "fraud_detector_v2.pt",
    score: 78,
    status: "Complete",
    date: "Mar 3, 2026",
    pages: 18,
    format: "PDF",
  },
  {
    id: "RPT-003",
    model: "sentiment_analyzer.onnx",
    score: 85,
    status: "Complete",
    date: "Mar 2, 2026",
    pages: 21,
    format: "PDF",
  },
  {
    id: "RPT-004",
    model: "recommender_sys.pkl",
    score: 64,
    status: "Complete",
    date: "Mar 1, 2026",
    pages: 16,
    format: "PDF",
  },
  {
    id: "RPT-005",
    model: "image_classifier.h5",
    score: 90,
    status: "Generating",
    date: "Mar 4, 2026",
    pages: 0,
    format: "PDF",
  },
]

function getScoreColor(score: number) {
  if (score >= 85) return "text-primary"
  if (score >= 70) return "text-chart-4"
  return "text-destructive"
}

export function ReportsContent() {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">11</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">1</p>
                <p className="text-xs text-muted-foreground">Generating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-foreground">Audit Reports</CardTitle>
              <CardDescription>All generated reports for your audited models</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-9 bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Report ID</TableHead>
                <TableHead className="text-muted-foreground">Model</TableHead>
                <TableHead className="text-muted-foreground">Trust Score</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Pages</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-border">
                  <TableCell className="font-mono text-xs text-foreground">{report.id}</TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-foreground">{report.model}</span>
                  </TableCell>
                  <TableCell>
                    {report.score > 0 ? (
                      <span className={`font-mono font-bold ${getScoreColor(report.score)}`}>
                        {report.score}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        report.status === "Complete"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-chart-4/10 text-chart-4 border-chart-4/20"
                      }`}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{report.date}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {report.pages > 0 ? report.pages : "--"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        disabled={report.status !== "Complete"}
                      >
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">View report</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        disabled={report.status !== "Complete"}
                      >
                        <Download className="w-4 h-4" />
                        <span className="sr-only">Download report</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        disabled={report.status !== "Complete"}
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="sr-only">Share report</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
