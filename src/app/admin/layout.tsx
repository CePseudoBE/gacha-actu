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
  Wrench
} from "lucide-react"

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
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">GA</span>
                  </div>
                  <span className="font-semibold text-lg">Back-Office</span>
                </Link>

                <nav className="hidden md:flex items-center gap-4">
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <HomeIcon className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin/games">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <GamepadIcon className="w-4 h-4" />
                      Jeux
                    </Button>
                  </Link>
                  <Link href="/admin/articles">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <NewspaperIcon className="w-4 h-4" />
                      Articles
                    </Button>
                  </Link>
                  <Link href="/admin/guides">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <BookOpenIcon className="w-4 h-4" />
                      Guides
                    </Button>
                  </Link>
                  <Link href="/admin/tags">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <span className="w-4 h-4 text-center">#</span>
                      Tags
                    </Button>
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/admin/maintenance">
                  <Button variant="ghost" size="sm">
                    <Wrench className="w-4 h-4 mr-2" />
                    Maintenance
                  </Button>
                </Link>
                <Link href="/admin/debug">
                  <Button variant="ghost" size="sm">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Debug
                  </Button>
                </Link>
                <Link href="/admin/preview">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Prévisualiser
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="sm">
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
                <Link href="/admin/settings" className="hover:text-foreground">
                  <SettingsIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
        </div>
      </AuthGuard>
    </SessionProvider>
  )
}