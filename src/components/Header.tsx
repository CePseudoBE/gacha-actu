import { GamepadIcon, Newspaper, Gamepad2, Calendar, Trophy, Twitter, Youtube, Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <GamepadIcon className="h-7 w-7 text-primary" />
            <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GachaActu
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <GamepadIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">GachaActu</span>
                  </div>
                  
                  <Link href="/news" className="flex items-center space-x-3 text-lg font-medium py-2 px-3 rounded-md hover:bg-accent">
                    <Newspaper className="h-5 w-5" />
                    <span>Actualités</span>
                  </Link>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 text-lg font-medium py-2 px-3 text-muted-foreground">
                      <Gamepad2 className="h-5 w-5" />
                      <span>Jeux</span>
                    </div>
                    <div className="ml-8 space-y-1">
                      <Link href="/games" className="block py-2 px-3 rounded-md hover:bg-accent">
                        Tous les jeux
                      </Link>
                      <Link href="/games/genshin-impact" className="block py-2 px-3 rounded-md hover:bg-accent">
                        Genshin Impact
                      </Link>
                      <Link href="/games/honkai-star-rail" className="block py-2 px-3 rounded-md hover:bg-accent">
                        Honkai Star Rail
                      </Link>
                      <Link href="/games/fire-emblem-heroes" className="block py-2 px-3 rounded-md hover:bg-accent">
                        Fire Emblem Heroes
                      </Link>
                      <Link href="/games/bleach-soul-resonance" className="block py-2 px-3 rounded-md hover:bg-accent">
                        Bleach Soul Resonance
                      </Link>
                      <Link href="/games/arknights" className="block py-2 px-3 rounded-md hover:bg-accent">
                        Arknights
                      </Link>
                    </div>
                  </div>
                  
                  <Link href="/evenements" className="flex items-center space-x-3 text-lg font-medium py-2 px-3 rounded-md hover:bg-accent">
                    <Calendar className="h-5 w-5" />
                    <span>Événements</span>
                  </Link>
                  
                  <Link href="/tier-lists" className="flex items-center space-x-3 text-lg font-medium py-2 px-3 rounded-md hover:bg-accent">
                    <Trophy className="h-5 w-5" />
                    <span>Tier Lists</span>
                  </Link>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-center space-x-4">
                      <Link 
                        href="https://discord.gg/ton-discord" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-md hover:bg-accent h-10 w-10"
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
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-md hover:bg-accent h-10 w-10"
                      >
                        <Twitter className="h-4 w-4" />
                      </Link>
                      <Link 
                        href="#" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-md hover:bg-accent h-10 w-10"
                      >
                        <Youtube className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Navigation centrée */}
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/news" className={navigationMenuTriggerStyle()}>
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
                    <div className="grid gap-3 p-6 w-[400px] md:w-[500px] md:grid-cols-2">
                      <div className="row-span-3">
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-accent/50 transition-colors"
                          href="/games"
                        >
                          <Gamepad2 className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Tous les jeux
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Découvrez tous les jeux Gacha
                          </p>
                        </Link>
                      </div>
                      
                      <Link href="/games/genshin-impact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Genshin Impact</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          RPG open-world avec système gacha
                        </p>
                      </Link>
                      
                      <Link href="/games/honkai-star-rail" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Honkai Star Rail</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          RPG au tour par tour spatial
                        </p>
                      </Link>
                      
                      <Link href="/games/fire-emblem-heroes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Fire Emblem Heroes</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Stratégie tactique mobile
                        </p>
                      </Link>
                      
                      <Link href="/games/bleach-soul-resonance" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Bleach Soul Resonance</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Action RPG basé sur l&apos;anime Bleach
                        </p>
                      </Link>
                      
                      <Link href="/games/arknights" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Arknights</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Tower defense stratégique
                        </p>
                      </Link>
                    </div>
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

          {/* Réseaux sociaux */}
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
              <Link 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 text-muted-foreground hover:text-foreground"
                title="Suivez-nous sur Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 text-muted-foreground hover:text-foreground"
                title="Abonnez-vous à notre chaîne YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

