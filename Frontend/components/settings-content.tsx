"use client"

import { useState } from "react"
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Save,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function SettingsContent() {
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    auditComplete: true,
    weeklyDigest: false,
    driftAlerts: true,
  })

  const [auditDefaults, setAuditDefaults] = useState({
    explainability: true,
    fairness: true,
    robustness: true,
    drift: true,
    calibration: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-secondary/40 border border-border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="audit">Audit Defaults</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Profile Settings</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-sm text-foreground">Display Name</Label>
                  <Input
                    id="name"
                    defaultValue="Public User"
                    className="bg-secondary/20 border-border text-foreground"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="user@example.com"
                    className="bg-secondary/20 border-border text-foreground"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="org" className="text-sm text-foreground">Organization</Label>
                  <Input
                    id="org"
                    defaultValue=""
                    placeholder="Optional"
                    className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="role" className="text-sm text-foreground">Role</Label>
                  <Input
                    id="role"
                    defaultValue="ML Practitioner"
                    className="bg-secondary/20 border-border text-foreground"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-fit">
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Defaults Tab */}
        <TabsContent value="audit" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Default Audit Configuration</CardTitle>
                  <CardDescription>
                    Choose which modules to enable by default when starting new audits
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {Object.entries(auditDefaults).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground capitalize">{key} Analysis</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {key === "explainability" && "SHAP-based feature importance and local explanations"}
                      {key === "fairness" && "Bias detection across protected attributes"}
                      {key === "robustness" && "Adversarial and perturbation testing"}
                      {key === "drift" && "Data and concept drift detection"}
                      {key === "calibration" && "Confidence calibration evaluation"}
                    </p>
                  </div>
                  <Switch
                    checked={val}
                    onCheckedChange={(checked) =>
                      setAuditDefaults((prev) => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-fit mt-2">
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Defaults
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Notification Preferences</CardTitle>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                { key: "email" as const, label: "Email Notifications", desc: "Receive notifications via email" },
                { key: "auditComplete" as const, label: "Audit Complete", desc: "Notify when an audit finishes" },
                { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Summary of audit activity each week" },
                { key: "driftAlerts" as const, label: "Drift Alerts", desc: "Real-time alerts for detected data drift" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for programmatic access to TrustLens
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Production Key</span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                      Active
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    Regenerate
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value="tl_prod_••••••••••••••••••••••••"
                    className="font-mono text-xs bg-secondary/40 border-border text-muted-foreground"
                  />
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary flex-shrink-0">
                    Copy
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Created Feb 15, 2026. Last used 2 hours ago.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Development Key</span>
                    <Badge variant="outline" className="text-[10px] bg-chart-4/10 text-chart-4 border-chart-4/20">
                      Test Mode
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    Regenerate
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value="tl_dev_••••••••••••••••••••••••"
                    className="font-mono text-xs bg-secondary/40 border-border text-muted-foreground"
                  />
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary flex-shrink-0">
                    Copy
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Created Feb 15, 2026. Last used 5 days ago.
                </p>
              </div>

              <Button variant="outline" className="border-border text-foreground hover:bg-secondary gap-2 w-fit mt-2">
                <Key className="w-4 h-4" />
                Create New API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
