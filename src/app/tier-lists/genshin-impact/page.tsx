import { GenshinAdvancedTierListExample } from "@/components/examples/GenshinAdvancedTierListExample"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Genshin Impact - Tier Lists",
  description: "Tier lists expertes pour Genshin Impact : personnages, armes et artéfacts classés par nos experts.",
  openGraph: {
    title: "Tier Lists Genshin Impact - GachaActu",
    description: "Optimisez vos équipes avec nos tier lists Genshin Impact mises à jour régulièrement.",
    type: "website",
  },
}

export default function GenshinTierListsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/tier-lists">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux jeux
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Genshin Impact
          </h1>
        </div>

        {/* Tier List */}
        <div className="max-w-6xl mx-auto">
          <GenshinAdvancedTierListExample />
        </div>

      </div>
    </div>
  )
}