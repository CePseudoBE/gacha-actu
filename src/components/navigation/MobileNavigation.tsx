import Link from "next/link"
import { Menu, Newspaper, Gamepad2, Calendar, Trophy, GamepadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SocialLinks } from "./SocialLinks"
import { NavigationConfig, NavigationItem, NavigationDropdownItem } from "@/types/navigation"

interface MobileNavigationProps {
  config: NavigationConfig
  isOpen: boolean
  onToggle: () => void
}

function isDropdownItem(item: NavigationItem | NavigationDropdownItem): item is NavigationDropdownItem {
  return 'children' in item
}

function getIcon(iconName?: string) {
  switch (iconName) {
    case 'Newspaper':
      return <Newspaper className="h-5 w-5" />
    case 'Gamepad2':
      return <Gamepad2 className="h-5 w-5" />
    case 'Calendar':
      return <Calendar className="h-5 w-5" />
    case 'Trophy':
      return <Trophy className="h-5 w-5" />
    default:
      return null
  }
}

export function MobileNavigation({ config, isOpen, onToggle }: MobileNavigationProps) {
  return (
    <div className="flex md:hidden">
      <Sheet open={isOpen} onOpenChange={onToggle}>
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
              <span className="font-bold text-lg">{config.logo.text}</span>
            </div>
            
            {config.items.map((item) => (
              <div key={item.id}>
                {isDropdownItem(item) ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 text-lg font-medium py-2 px-3 text-muted-foreground">
                      {getIcon(item.icon)}
                      <span>{item.label}</span>
                    </div>
                    <div className="ml-8 space-y-1">
                      <Link 
                        href={item.href} 
                        className="block py-2 px-3 rounded-md hover:bg-accent"
                        onClick={onToggle}
                      >
                        {item.featured ? item.featured.label : 'Tous'}
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className="block py-2 px-3 rounded-md hover:bg-accent"
                          onClick={onToggle}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="flex items-center space-x-3 text-lg font-medium py-2 px-3 rounded-md hover:bg-accent"
                    onClick={onToggle}
                  >
                    {getIcon(item.icon)}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
              <SocialLinks links={config.socialLinks} variant="mobile" className="justify-center" />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}