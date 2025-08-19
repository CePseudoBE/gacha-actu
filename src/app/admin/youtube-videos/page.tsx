"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Youtube, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface YouTubeVideo {
  id: string
  videoId: string
  title: string
  description?: string
  thumbnail?: string
  channelTitle?: string
  publishedAt?: string
  category?: string
  duration?: string
  isActive: boolean
  order: number
  game?: {
    id: string
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

export default function YouTubeVideosAdminPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/youtube-videos')
      const data = await response.json()
      
      if (data.success) {
        setVideos(data.data)
        setError(null)
      } else {
        const errorMsg = data.error || 'Erreur lors du chargement'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error('Erreur:', error)
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const toggleVideoStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/youtube-videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      const data = await response.json()

      if (data.success) {
        await fetchVideos()
        toast.success(`Vidéo ${!currentStatus ? 'activée' : 'désactivée'} avec succès`)
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error('Erreur de connexion')
    }
  }

  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/youtube-videos/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchVideos()
        toast.success('Vidéo supprimée avec succès')
        setDeleteVideoId(null)
      } else {
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur de connexion')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Erreur: {error}</p>
          <Button onClick={fetchVideos} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gestion des vidéos YouTube</h1>
            <p className="text-muted-foreground">
              Gérez les vidéos affichées dans le carousel
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/youtube-videos/add">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une vidéo
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Youtube className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune vidéo</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter votre première vidéo YouTube
              </p>
              <Button asChild>
                <Link href="/admin/youtube-videos/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une vidéo
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden relative">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Youtube className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Youtube className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                        {video.channelTitle && (
                          <p className="text-sm text-red-600 font-medium mb-2">
                            {video.channelTitle}
                          </p>
                        )}
                        {video.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant={video.isActive ? "default" : "secondary"}>
                            {video.isActive ? "Actif" : "Inactif"}
                          </Badge>
                          {video.category && (
                            <Badge variant="outline">
                              {video.category}
                            </Badge>
                          )}
                          {video.game && (
                            <Badge variant="outline">
                              {video.game.name}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            Ordre: {video.order}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>ID: {video.videoId}</span>
                          {video.duration && <span>Durée: {video.duration}</span>}
                          {video.publishedAt && (
                            <span>
                              Publié: {new Date(video.publishedAt).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleVideoStatus(video.id, video.isActive)}
                        >
                          {video.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/youtube-videos/edit/${video.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette vidéo ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer la vidéo "{video.title}" ? 
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteVideo(video.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}