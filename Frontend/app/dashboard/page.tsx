import { PageHeader } from "@/components/page-header"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        section="Main"
        page="Dashboard"
        description="Overview of your model audits, trust scores, and recent activity."
      />
      <DashboardContent />
    </>
  )
}
