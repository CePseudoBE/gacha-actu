"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { MaintenanceAlert } from "@/components/admin/MaintenanceAlert"
import { 
  HomeIcon, 
  GamepadIcon, 
  NewspaperIcon, 
  BookOpenIcon, 
  SettingsIcon,
  Eye,
  Wrench,
  Youtube
} from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthGuard requiredRole="admin">
        <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/admin" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">GA</span>
                  </div>
                  <span className="font-semibold text-lg">Back-Office</span>
                </Link>

                <NavigationMenu className="hidden md:block">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/admin" className={navigationMenuTriggerStyle()}>
                        <HomeIcon className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/admin/games" className={navigationMenuTriggerStyle()}>
                        <GamepadIcon className="w-4 h-4 mr-2" />
                        Jeux
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/admin/articles" className={navigationMenuTriggerStyle()}>
                        <NewspaperIcon className="w-4 h-4 mr-2" />
                        Articles
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/admin/guides" className={navigationMenuTriggerStyle()}>
                        <BookOpenIcon className="w-4 h-4 mr-2" />
                        Guides
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/admin/tags" className={navigationMenuTriggerStyle()}>
                        <span className="w-4 h-4 text-center mr-2">#</span>
                        Tags
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/admin/youtube-videos" className={navigationMenuTriggerStyle()}>
                        <Youtube className="w-4 h-4 mr-2" />
                        Vidéos
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="flex items-center gap-2">
                <NavigationMenu className="hidden md:block">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Système
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[300px]">
                          <Link
                            href="/admin/maintenance"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center text-sm font-medium leading-none">
                              <Wrench className="w-4 h-4 mr-2" />
                              Maintenance
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gestion du mode maintenance du site
                            </p>
                          </Link>
                          <Link
                            href="/admin/debug"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center text-sm font-medium leading-none">
                              <SettingsIcon className="w-4 h-4 mr-2" />
                              Debug
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Outils de débogage et diagnostics
                            </p>
                          </Link>
                          <Link
                            href="/admin/preview"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center text-sm font-medium leading-none">
                              <Eye className="w-4 h-4 mr-2" />
                              Prévisualiser
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Prévisualisation du site en live
                            </p>
                          </Link>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Link href="/">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Retour au site
                  </Button>
                </Link>
                <AuthHeader />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>© 2024 GachaActu - Back-Office</p>
              <div className="flex items-center gap-4">
                <Link href="/admin/settings" className="hover:text-foreground cursor-pointer">
                  <SettingsIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
        </div>
        <Toaster />
      </AuthGuard>
    </SessionProvider>
  )
}