"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronUp, 
  ChevronDown,
  FileText 
} from "lucide-react"

export interface Section {
  id: string
  title: string
  content: string
  order: number
}

interface SectionsEditorProps {
  sections: Section[]
  onChange: (sections: Section[]) => void
  disabled?: boolean
}

export function SectionsEditor({ sections, onChange, disabled = false }: SectionsEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Ajouter une nouvelle section
  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "",
      content: "",
      order: sections.length
    }
    onChange([...sections, newSection])
    setExpandedSection(newSection.id)
  }

  // Supprimer une section
  const removeSection = (id: string) => {
    const filtered = sections.filter(s => s.id !== id)
    // Réordonner après suppression
    const reordered = filtered.map((section, index) => ({
      ...section,
      order: index
    }))
    onChange(reordered)
    if (expandedSection === id) {
      setExpandedSection(null)
    }
  }

  // Modifier une section
  const updateSection = (id: string, field: keyof Section, value: string) => {
    const updated = sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    )
    onChange(updated)
  }

  // Déplacer une section
  const moveSection = (id: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === id)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const newSections = [...sections]
    
    // Échanger les positions
    ;[newSections[currentIndex], newSections[newIndex]] = 
     [newSections[newIndex], newSections[currentIndex]]
    
    // Mettre à jour les ordres
    const reordered = newSections.map((section, index) => ({
      ...section,
      order: index
    }))

    onChange(reordered)
  }

  // Calculer les statistiques
  const totalContent = sections.reduce((acc, section) => 
    acc + section.title.length + section.content.length, 0
  )

  return (
    <div className="space-y-4">
      {/* Header avec stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-medium">Sections du guide</span>
          <Badge variant="outline">
            {sections.length} section{sections.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalContent.toLocaleString()} caractères
        </div>
      </div>

      {/* Liste des sections */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <Card key={section.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <CardTitle className="text-base">
                    Section {index + 1}
                    {section.title && `: ${section.title}`}
                  </CardTitle>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Boutons de déplacement */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={disabled || index === 0}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={disabled || index === sections.length - 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                  
                  {/* Bouton de suppression */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                    disabled={disabled}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Titre de la section */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Titre de la section *
                </label>
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  placeholder="ex: Configuration de base"
                  disabled={disabled}
                />
              </div>

              {/* Contenu de la section */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Contenu *
                </label>
                <Textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  placeholder="Contenu de cette section en Markdown..."
                  rows={6}
                  disabled={disabled}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {section.content.length} caractères • Support Markdown
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucune section */}
      {sections.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Aucune section</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Structurez votre guide en sections pour une meilleure lisibilité
            </p>
            <Button onClick={addSection} disabled={disabled}>
              <Plus className="w-4 h-4 mr-2" />
              Créer la première section
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bouton d'ajout */}
      {sections.length > 0 && (
        <Button 
          variant="outline" 
          onClick={addSection} 
          disabled={disabled}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une section
        </Button>
      )}

      {/* Aide */}
      <div className="bg-accent/50 rounded-lg p-3 text-sm">
        <div className="font-medium mb-1">💡 Conseils</div>
        <ul className="text-muted-foreground space-y-1">
          <li>• Utilisez des titres descriptifs pour chaque section</li>
          <li>• Le contenu supporte le format Markdown</li>
          <li>• Organisez vos sections du plus général au plus spécifique</li>
          <li>• Visez 200-500 mots par section pour une lecture agréable</li>
        </ul>
      </div>
    </div>
  )
}