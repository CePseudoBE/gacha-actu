import Link from "next/link"
import Image from "next/image"
import { PartnerLink } from "@/types/hero"

interface HeroPartnersProps {
  partners: PartnerLink[]
}

export function HeroPartners({ partners }: HeroPartnersProps) {
  return (
    <div className="mt-6">
      {/* Mobile - Icônes côte à côte */}
      <div className="lg:hidden flex gap-4 items-center">
        {partners.map((partner) => (
          <Link 
            key={partner.id}
            href={partner.href}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            <Image
              src={partner.logo.mobile}
              alt={partner.alt}
              width={partner.dimensions.mobile.width}
              height={partner.dimensions.mobile.height}
            />
          </Link>
        ))}
      </div>
      
      {/* Desktop - Logos côte à côte */}
      <div className="hidden lg:flex gap-6 items-center">
        {partners.map((partner) => (
          <Link 
            key={partner.id}
            href={partner.href}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={partner.logo.desktop}
              alt={partner.alt}
              width={partner.dimensions.desktop.width}
              height={partner.dimensions.desktop.height}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}