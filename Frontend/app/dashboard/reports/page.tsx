import { PageHeader } from "@/components/page-header"
import { ReportsContent } from "@/components/reports-content"

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        section="Management"
        page="Reports"
        description="View and manage generated audit reports. Download or share them with your team."
      />
      <ReportsContent />
    </>
  )
}
