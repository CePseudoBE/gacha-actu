import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Upload, Link as LinkIcon } from "lucide-react"

export default function ImageHelpPage() {
  const supportedDomains = [
    "images.unsplash.com",
    "via.placeholder.com", 
    "i.imgur.com",
    "res.cloudinary.com",
    "static.wikia.nocookie.net",
    "genshin.hoyoverse.com",
    "webstatic.hoyoverse.com",
    "pbs.twimg.com"
  ]

  const imageSpecs = [
    {
      type: "Jeux - Image de couverture",
      ratio: "2:3 (portrait)",
      size: "400x600px recommandé",
      example: "Affiche du jeu, artwork principal"
    },
    {
      type: "Jeux - Logo",
      ratio: "1:1 (carré)",
      size: "256x256px recommandé", 
      example: "Icône/logo du jeu"
    },
    {
      type: "Articles",
      ratio: "16:9 (paysage)",
      size: "1200x675px recommandé",
      example: "Screenshot, artwork lié à l'actualité"
    },
    {
      type: "Guides",
      ratio: "16:9 (paysage)",
      size: "1200x675px recommandé",
      example: "Image illustrant le guide, personnage"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Guide des Images</h1>
          <p className="text-muted-foreground">Comment utiliser les images dans le back-office</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Méthodes d'ajout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Méthodes d'ajout d'images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold">Par URL</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Collez l'URL d'une image hébergée en ligne
                </p>
                <Badge variant="secondary">Recommandé</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-green-500" />
                  <h3 className="font-semibold">Upload de fichier</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Uploadez directement depuis votre ordinateur
                </p>
                <Badge variant="outline">Simulation</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spécifications */}
        <Card>
          <CardHeader>
            <CardTitle>Spécifications par type de contenu</CardTitle>
            <CardDescription>
              Dimensions et formats recommandés pour chaque utilisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imageSpecs.map((spec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{spec.type}</h3>
                    <Badge variant="outline">{spec.ratio}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Taille: </span>
                      <span className="font-medium">{spec.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Exemple: </span>
                      <span>{spec.example}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Domaines supportés */}
        <Card>
          <CardHeader>
            <CardTitle>Domaines d'images supportés</CardTitle>
            <CardDescription>
              Liste des sites dont vous pouvez utiliser les images directement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {supportedDomains.map((domain) => (
                <div key={domain} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  <code className="text-sm">{domain}</code>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✅ Pattern générique <code>**</code> activé pour la compatibilité maximale
            </p>
          </CardContent>
        </Card>

        {/* Bonnes pratiques */}
        <Card>
          <CardHeader>
            <CardTitle>Bonnes pratiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Utilisez des images de qualité</p>
                  <p className="text-sm text-muted-foreground">Préférez les formats WebP, PNG ou JPG haute résolution</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Respectez les ratios</p>
                  <p className="text-sm text-muted-foreground">Les bonnes proportions améliorent l'affichage sur le site</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Optimisez le poids</p>
                  <p className="text-sm text-muted-foreground">Images &lt; 500KB pour un chargement rapide</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Vérifiez les droits</p>
                  <p className="text-sm text-muted-foreground">Assurez-vous d'avoir le droit d'utiliser les images</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sources recommandées */}
        <Card>
          <CardHeader>
            <CardTitle>Sources d'images recommandées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Images officielles</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Sites officiels des jeux</li>
                  <li>• Comptes Twitter/X officiels</li>
                  <li>• Press kits des développeurs</li>
                  <li>• Wikis communautaires</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Images libres</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Unsplash (déjà configuré)</li>
                  <li>• Pexels</li>
                  <li>• Pixabay</li>
                  <li>• Imgur (screenshots)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}