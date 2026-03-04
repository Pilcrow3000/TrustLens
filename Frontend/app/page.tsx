import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { FeaturesSection } from "@/components/features-section"
import { DashboardPreview } from "@/components/dashboard-preview"
import { WorkflowSection } from "@/components/workflow-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { OutcomesSection } from "@/components/outcomes-section"
import { ApplicationsSection } from "@/components/applications-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <SectionDivider />
      <ProblemSection />
      <SectionDivider />
      <FeaturesSection />
      <DashboardPreview />
      <SectionDivider />
      <WorkflowSection />
      <SectionDivider />
      <TechStackSection />
      <SectionDivider />
      <OutcomesSection />
      <SectionDivider />
      <ApplicationsSection />
      <CTASection />
      <Footer />
    </main>
  )
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
