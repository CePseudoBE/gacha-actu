"use client"

import { Logo } from "./navigation/Logo"
import { DesktopNavigation } from "./navigation/DesktopNavigation"
import { MobileNavigation } from "./navigation/MobileNavigation"
import { SocialLinks } from "./navigation/SocialLinks"
import { useNavigation } from "@/hooks/useNavigation"
import { navigationConfig } from "@/config/navigation"

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu } = useNavigation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo 
            text={navigationConfig.logo.text}
            href={navigationConfig.logo.href}
          />

          {/* Menu mobile */}
          <MobileNavigation 
            config={navigationConfig}
            isOpen={isMobileMenuOpen}
            onToggle={toggleMobileMenu}
          />
          
          {/* Navigation centrée */}
          <DesktopNavigation config={navigationConfig} />

          {/* Réseaux sociaux */}
          <div className="hidden md:flex md:flex-1 md:justify-end">
            <SocialLinks 
              links={navigationConfig.socialLinks} 
              variant="desktop"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

