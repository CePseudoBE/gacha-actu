export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  description?: string
}

export interface NavigationDropdownItem extends NavigationItem {
  children: NavigationItem[]
  featured?: NavigationItem
}

export interface SocialLink {
  id: string
  name: string
  href: string
  icon: string
  iconType: 'lucide' | 'custom'
  ariaLabel: string
}

export interface NavigationConfig {
  logo: {
    text: string
    href: string
  }
  items: (NavigationItem | NavigationDropdownItem)[]
  socialLinks: SocialLink[]
}

export interface MobileNavigationProps {
  config: NavigationConfig
}

export interface DesktopNavigationProps {
  config: NavigationConfig
}