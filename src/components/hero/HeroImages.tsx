import Image from "next/image"
import { HeroImage } from "@/types/hero"

interface HeroImagesProps {
  images: HeroImage[]
}

export function HeroImages({ images }: HeroImagesProps) {
  return (
    <div className="hidden lg:flex gap-6 items-center">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <div className="w-56 h-[28rem] rounded-2xl shadow-2xl transform rotate-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 1024px) 0vw, 224px"
              priority={image.priority}
            />
          </div>
        </div>
      ))}
    </div>
  )
}