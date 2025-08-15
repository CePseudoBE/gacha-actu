import Link from "next/link"
import { Newspaper, Gamepad2, Calendar, Trophy } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { NavigationConfig, NavigationItem, NavigationDropdownItem } from "@/types/navigation"

interface DesktopNavigationProps {
  config: NavigationConfig
}

function isDropdownItem(item: NavigationItem | NavigationDropdownItem): item is NavigationDropdownItem {
  return 'children' in item
}

function getIcon(iconName?: string) {
  switch (iconName) {
    case 'Newspaper':
      return <Newspaper className="mr-2 h-4 w-4" />
    case 'Gamepad2':
      return <Gamepad2 className="mr-2 h-4 w-4" />
    case 'Calendar':
      return <Calendar className="mr-2 h-4 w-4" />
    case 'Trophy':
      return <Trophy className="mr-2 h-4 w-4" />
    default:
      return null
  }
}

export function DesktopNavigation({ config }: DesktopNavigationProps) {
  return (
    <div className="hidden md:flex md:flex-1 md:justify-center">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {config.items.map((item) => (
            <NavigationMenuItem key={item.id}>
              {isDropdownItem(item) ? (
                <>
                  <NavigationMenuTrigger>
                    {getIcon(item.icon)}
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] md:w-[500px] md:grid-cols-2">
                      {item.featured && (
                        <div className="row-span-3">
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-accent/50 transition-colors"
                            href={item.featured.href}
                          >
                            {getIcon(item.icon)}
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {item.featured.label}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {item.featured.description}
                            </p>
                          </Link>
                        </div>
                      )}
                      
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{child.label}</div>
                          {child.description && (
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {child.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={item.href} className={navigationMenuTriggerStyle()}>
                  {getIcon(item.icon)}
                  {item.label}
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}