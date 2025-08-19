import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter, ExternalLink, Users, Bell } from "lucide-react"
import Link from "next/link"

interface SocialSectionProps {
  twitterUsername?: string
  discordInvite?: string
  customMessage?: string
}

export function SocialSection({ 
  twitterUsername = "votrecompte",
  discordInvite,
  customMessage = "Rejoignez notre communauté pour ne rien manquer !"
}: SocialSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Users className="w-6 h-6 text-primary" />
          Suivez-nous
        </CardTitle>
        <p className="text-muted-foreground">
          {customMessage}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Twitter/X */}
        <Link 
          href={`https://twitter.com/${twitterUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:border-blue-200 transition-colors">
            <Twitter className="w-5 h-5 text-blue-500" />
            <div className="text-left flex-1">
              <div className="font-medium">Twitter / X</div>
              <div className="text-sm text-muted-foreground">@{twitterUsername}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>
        </Link>

        {/* Discord */}
        {discordInvite && (
          <Link 
            href={discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">Discord</div>
                <div className="text-sm text-muted-foreground">Rejoindre le serveur</div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
        )}

        {/* Newsletter/Notifications */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Bell className="w-4 h-4" />
            <span>Restez informé des dernières actualités</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Suivez-nous sur nos réseaux pour ne manquer aucune news sur vos jeux Gacha préférés !
          </p>
        </div>
      </CardContent>
    </Card>
  )
}