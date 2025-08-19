"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Youtube, Gamepad2, BookOpen, TrendingUp, Star, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { YouTubeVideo } from "./YouTubeVideo"
import { cn } from "@/lib/utils"

interface YouTubeVideoData {
  id: string
  videoId: string
  title: string
  description?: string
  publishedAt?: string
  channelTitle?: string
  thumbnail?: string
  category?: string
}

interface YouTubeCarouselProps {
  videos: YouTubeVideoData[]
  title?: string
  className?: string
}

export function YouTubeCarousel({ 
  videos, 
  title = "Vidéos Récentes",
  className 
}: YouTubeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)

  // Responsive - adapter le nombre de vidéos visibles
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1280) { // xl
        setVisibleCount(3)
      } else if (window.innerWidth >= 768) { // md
        setVisibleCount(2)
      } else {
        setVisibleCount(1)
      }
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  const canGoNext = currentIndex < videos.length - visibleCount
  const canGoPrev = currentIndex > 0

  const goNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const goPrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, videos.length - visibleCount)
    setCurrentIndex(Math.min(index, maxIndex))
  }

  if (!videos.length) {
    return null
  }

  return (
    <section className={cn("py-16 bg-background", className)}>
      <div className="container mx-auto px-4">
        {/* Header avec style distinct */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-muted-foreground text-sm">
                Découvrez les dernières vidéos de la communauté
              </p>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goNext}
              disabled={!canGoNext}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Carousel container */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`
              }}
            >
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={cn(
                    "flex-shrink-0 px-2",
                    visibleCount === 1 && "w-full",
                    visibleCount === 2 && "w-1/2",
                    visibleCount === 3 && "w-1/3"
                  )}
                >
                  <div className="group">
                    <YouTubeVideo
                      videoId={video.videoId}
                      title={video.title}
                      thumbnail={video.thumbnail}
                      className="mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    />
                    
                    {/* Metadata */}
                    <div className="px-2">
                      {video.channelTitle && (
                        <p className="text-xs text-red-600 font-medium mb-1">
                          {video.channelTitle}
                        </p>
                      )}
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                          {video.description}
                        </p>
                      )}
                      {video.publishedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(video.publishedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={!canGoNext}
              className="rounded-full"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(videos.length / visibleCount) }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * visibleCount)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                Math.floor(currentIndex / visibleCount) === index
                  ? "bg-red-600 w-6"
                  : "bg-muted hover:bg-muted-foreground/20"
              )}
              aria-label={`Aller à la page ${index + 1}`}
            />
          ))}
        </div>

        {/* Voir plus */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            asChild
          >
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Youtube className="w-4 h-4 mr-2" />
              Voir plus sur YouTube
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}