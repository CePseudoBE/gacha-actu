import { BaseSanitizer } from './base-sanitizer'

/**
 * Sanitizer pour slugs - Extensible selon OCP
 */

export class SlugSanitizer extends BaseSanitizer {
  constructor(maxLength?: number) {
    super(maxLength || 100)
  }

  sanitize(input: string): string {
    if (!this.isValidInput(input)) return ''

    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^a-z0-9-]/g, "") // Garder seulement alphanumériques et tirets
      .replace(/-+/g, "-") // Consolider les tirets multiples
      .replace(/(^-|-$)/g, "") // Supprimer les tirets en début/fin
      .substring(0, this.maxLength)
  }
}