import { PageHeader } from "@/components/page-header"
import { HistoryContent } from "@/components/history-content"

export default function HistoryPage() {
  return (
    <>
      <PageHeader
        section="Management"
        page="Audit History"
        description="Complete timeline of all model audits performed on this account."
      />
      <HistoryContent />
    </>
  )
}
