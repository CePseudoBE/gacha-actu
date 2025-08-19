import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gestion des guides - Admin",
  description: "Interface d'administration pour la gestion des guides"
}

export default function GuidesAdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des guides</h1>
      <p className="text-muted-foreground">Page en cours de développement</p>
    </div>
  )
}