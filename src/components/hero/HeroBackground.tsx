import Image from "next/image"
import { HeroImage } from "@/types/hero"

interface HeroBackgroundProps {
  images: HeroImage[]
}

export function HeroBackground({ images }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 lg:hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40 z-10" />
      <div className="flex h-full">
        {images.map((image, index) => (
          <div key={index} className="flex-1 relative">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center opacity-30"
              sizes="50vw"
              priority={image.priority}
            />
          </div>
        ))}
      </div>
    </div>
  )
}