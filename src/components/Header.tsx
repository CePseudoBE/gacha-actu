import { GamepadIcon, Newspaper, Gamepad2, Calendar, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo centré sur mobile, à gauche sur desktop */}
          <div className="flex items-center space-x-2 md:flex-1">
            <GamepadIcon className="h-7 w-7 text-primary" />
            <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              GachaActu
            </Link>
          </div>
          
          {/* Navigation centrée */}
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/actualites" className={navigationMenuTriggerStyle()}>
                    <Newspaper className="mr-2 h-4 w-4" />
                    Actualités
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Jeux
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/jeux"
                          >
                            <Gamepad2 className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Tous les jeux
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Découvrez notre couverture complète des jeux Gacha
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <ListItem href="/jeux/genshin-impact" title="Genshin Impact">
                          RPG open-world avec système gacha
                        </ListItem>
                      </li>
                      <li>
                        <ListItem href="/jeux/honkai-star-rail" title="Honkai Star Rail">
                          RPG au tour par tour spatial
                        </ListItem>
                      </li>
                      <li>
                        <ListItem href="/jeux/fire-emblem-heroes" title="Fire Emblem Heroes">
                          Stratégie tactique mobile
                        </ListItem>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/evenements" className={navigationMenuTriggerStyle()}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Événements
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/tier-lists" className={navigationMenuTriggerStyle()}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Tier Lists
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Discord et autres liens */}
          <div className="hidden md:flex md:flex-1 md:justify-end">
            <div className="flex items-center space-x-2">
              <Link 
                href="https://discord.gg/ton-discord" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                title="Rejoignez notre Discord"
              >
                <Image 
                  src="/icons/discord.svg" 
                  alt="Discord" 
                  width={20} 
                  height={20}
                  className="transition-opacity hover:opacity-80"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const ListItem = ({ className, title, children, href, ...props }: {
  className?: string
  title: string
  children: React.ReactNode
  href: string
}) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  )
}