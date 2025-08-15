import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Eye } from "lucide-react"

const previewLinks = [
  {
    title: "Page d'accueil",
    description: "Vue principale du site avec articles populaires",
    href: "/",
    color: "bg-blue-100 text-blue-800"
  },
  {
    title: "Tous les articles",
    description: "Page listant tous les articles avec filtres",
    href: "/news",
    color: "bg-green-100 text-green-800"
  },
  {
    title: "Tous les guides", 
    description: "Page listant tous les guides disponibles",
    href: "/guides",
    color: "bg-purple-100 text-purple-800"
  },
  {
    title: "Jeux",
    description: "Page listant tous les jeux référencés",
    href: "/games",
    color: "bg-orange-100 text-orange-800"
  },
  {
    title: "Tier Lists",
    description: "Page des classements de personnages",
    href: "/tier-lists",
    color: "bg-red-100 text-red-800"
  }
]

export default function AdminPreviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Prévisualisation du Site</h1>
          <p className="text-muted-foreground">Accédez rapidement aux différentes pages du site</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Retour au Dashboard</Button>
        </Link>
      </div>

      {/* Pages principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {previewLinks.map((link) => (
          <Card key={link.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <Badge className={link.color}>
                  Public
                </Badge>
              </div>
              <CardDescription>
                {link.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir la page
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Liens utiles pour la gestion du contenu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/articles/add">
              <Button variant="outline" className="w-full">
                Créer un article
              </Button>
            </Link>
            <Link href="/admin/guides/add">
              <Button variant="outline" className="w-full">
                Créer un guide
              </Button>
            </Link>
            <Link href="/admin/games/add">
              <Button variant="outline" className="w-full">
                Ajouter un jeu
              </Button>
            </Link>
            <Link href="/admin/tags">
              <Button variant="outline" className="w-full">
                Gérer les tags
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}