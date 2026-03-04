import { PageHeader } from "@/components/page-header"
import { ResultsContent } from "@/components/results-content"

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        section="Main"
        page="Audit Results"
        description="Detailed analysis of the most recent model audit, including trust scores and dimensional breakdowns."
      />
      <ResultsContent />
    </>
  )
}
