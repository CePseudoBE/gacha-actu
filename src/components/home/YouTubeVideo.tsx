"use client"

import { useState, useRef, useEffect } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface YouTubeVideoProps {
  videoId: string
  title: string
  thumbnail?: string
  className?: string
  autoplay?: boolean
}

export function YouTubeVideo({ 
  videoId, 
  title, 
  thumbnail, 
  className,
  autoplay = false 
}: YouTubeVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Générer l'URL de la thumbnail YouTube si pas fournie
  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  // Intersection Observer pour le lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1, // Se déclenche quand 10% de l'élément est visible
        rootMargin: '50px' // Se prépare 50px avant d'être visible
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handlePlay = () => {
    setIsLoaded(true)
  }

  const iframeUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0', // Ne pas afficher les vidéos suggérées
    modestbranding: '1', // Réduire le branding YouTube
    playsinline: '1', // Jouer en ligne sur mobile
    enablejsapi: '1', // Activer l'API JavaScript
    origin: typeof window !== 'undefined' ? window.location.origin : ''
  }).toString()}`

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative aspect-video bg-muted rounded-xl overflow-hidden group",
        "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        className
      )}
    >
      {!isLoaded ? (
        <>
          {/* Thumbnail avec lazy loading */}
          {isInView && (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback si la thumbnail ne charge pas
                const target = e.target as HTMLImageElement
                target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              }}
            />
          )}
          
          {/* Bouton play superposé */}
          <button
            onClick={handlePlay}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-black/20 transition-all duration-300",
              "group-hover:bg-black/30"
            )}
            aria-label={`Lire la vidéo: ${title}`}
          >
            <div className="bg-red-600 rounded-full p-4 shadow-xl transform transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </button>

          {/* Titre de la vidéo */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-medium text-sm md:text-base line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Placeholder si pas encore en vue */}
          {!isInView && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="bg-muted-foreground/20 rounded-full p-4">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
          )}
        </>
      ) : (
        /* Iframe YouTube chargé uniquement au clic */
        <iframe
          src={iframeUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  )
}