import { PageHeader } from "@/components/page-header"
import { UploadContent } from "@/components/upload-content"

export default function UploadPage() {
  return (
    <>
      <PageHeader
        section="Main"
        page="Upload Model"
        description="Upload your trained machine learning model for a comprehensive trust audit."
      />
      <UploadContent />
    </>
  )
}
