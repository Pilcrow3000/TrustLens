import { PageHeader } from "@/components/page-header"
import { SettingsContent } from "@/components/settings-content"

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        section="System"
        page="Settings"
        description="Manage your account, audit preferences, and platform configuration."
      />
      <SettingsContent />
    </>
  )
}
