import Link from "next/link"
import Image from "next/image"
import { GamepadIcon, Heart, Youtube, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GamepadIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                GachaActu
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Par un fan, pour les fans. Votre source d'actualités et de guides pour l'univers des jeux Gacha.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Fait avec</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>pour la communauté</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-foreground transition-colors">
                  Jeux
                </Link>
              </li>
              <li>
                <Link href="/evenements" className="text-muted-foreground hover:text-foreground transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/tier-lists" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tier Lists
                </Link>
              </li>
            </ul>
          </div>

          {/* Jeux populaires */}
          <div>
            <h3 className="font-semibold mb-4">Jeux populaires</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/games/genshin-impact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Genshin Impact
                </Link>
              </li>
              <li>
                <Link href="/games/honkai-star-rail" className="text-muted-foreground hover:text-foreground transition-colors">
                  Honkai Star Rail
                </Link>
              </li>
              <li>
                <Link href="/games/bleach-soul-resonance" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bleach Soul Resonance
                </Link>
              </li>
              <li>
                <Link href="/games/seven-deadly-sins-origins" className="text-muted-foreground hover:text-foreground transition-colors">
                  Seven Deadly Sins Origins
                </Link>
              </li>
              <li>
                <Link href="/games/fire-emblem-heroes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Fire Emblem Heroes
                </Link>
              </li>
            </ul>
          </div>

          {/* Partenaires & Communauté */}
          <div>
            <h3 className="font-semibold mb-4">Partenaires</h3>
            <div className="space-y-4">
              <Link 
                href="https://leap.ldplayer.gg/T4DYBI9Ic"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Image
                  src="/icons/ldplayer.svg"
                  alt="LDPlayer"
                  width={20}
                  height={20}
                />
                LDPlayer
              </Link>
              <Link 
                href="https://fr.gamesplanet.com/"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Image
                  src="/icons/gamesplanetsmall.png"
                  alt="Gamesplanet"
                  width={20}
                  height={20}
                />
                Gamesplanet
              </Link>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-3">Communauté</h4>
              <div className="flex items-center gap-3">
                <Link 
                  href="https://discord.gg/ton-discord" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Discord"
                >
                  <Image 
                    src="/icons/discord.svg" 
                    alt="Discord" 
                    width={20} 
                    height={20}
                  />
                </Link>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 GachaActu. Tous droits réservés. Fait avec passion pour la communauté Gacha.</p>
        </div>
      </div>
    </footer>
  )
}