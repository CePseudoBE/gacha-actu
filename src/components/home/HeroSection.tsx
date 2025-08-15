import { HeroBackground } from "../hero/HeroBackground"
import { HeroContent } from "../hero/HeroContent"
import { HeroPartners } from "../hero/HeroPartners"
import { HeroImages } from "../hero/HeroImages"
import { heroConfig } from "@/config/hero"

export function HeroSection() {
  const { title, subtitle, buttons, partners, images } = heroConfig

  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-background to-card overflow-hidden">
      {/* Background images for mobile - subtle overlay */}
      <HeroBackground images={images.mobile} />

      <div className="container mx-auto px-4 h-full relative z-20">
        <div className="flex items-center justify-between h-full min-h-[80vh] gap-12">
          {/* Left side - Title and text */}
          <div className="flex-1">
            <HeroContent 
              title={title}
              subtitle={subtitle}
              buttons={buttons}
            />
            
            {/* Partenaires */}
            <HeroPartners partners={partners} />
          </div>

          {/* Desktop images */}
          <HeroImages images={images.desktop} />
        </div>
      </div>
    </section>
  )
}