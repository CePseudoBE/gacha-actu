"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ExternalLink } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label: string
  placeholder?: string
  accept?: string
  maxSizeMB?: number
  aspectRatio?: string
  description?: string
}

export function ImageUpload({
  value = "",
  onChange,
  label,
  placeholder = "https://example.com/image.jpg",
  accept = "image/*",
  maxSizeMB = 5,
  aspectRatio,
  description
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulation d'upload (à remplacer par votre service d'upload)
  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulation d'upload avec delay
      setTimeout(() => {
        // En production, ici vous uploaderiez vers votre service (Cloudinary, S3, etc.)
        const fakeUrl = `https://via.placeholder.com/400x600/000000/FFFFFF?text=${encodeURIComponent(file.name)}`
        resolve(fakeUrl)
      }, 2000)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérification du type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    // Vérification de la taille
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`L'image doit faire moins de ${maxSizeMB}MB`)
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadFile(file)
      onChange(url)
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
  }

  const clearImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Toggle upload method */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMethod === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMethod("url")}
        >
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMethod === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMethod("file")}
        >
          Upload
        </Button>
      </div>

      {/* URL Input */}
      {uploadMethod === "url" && (
        <div className="space-y-2">
          <Input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
          />
          {value && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="w-3 h-3" />
              <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Voir l'image
              </a>
            </div>
          )}
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === "file" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Upload en cours..." : "Choisir une image"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Formats acceptés: JPG, PNG, WebP. Taille max: {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative">
          <div className={`relative rounded-lg overflow-hidden border ${aspectRatio || "aspect-[2/3]"} w-32`}>
            <Image
              src={value}
              alt="Aperçu"
              fill
              className="object-cover"
              onError={(e) => {
                console.error('Erreur de chargement de l\'image:', value)
                // Fallback vers une image placeholder
                const target = e.target as HTMLImageElement
                target.src = `https://via.placeholder.com/400x600/e5e7eb/6b7280?text=Erreur+de+chargement`
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 p-0"
            onClick={clearImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}