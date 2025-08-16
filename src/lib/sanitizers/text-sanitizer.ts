import { BaseSanitizer } from './base-sanitizer'

/**
 * Sanitizer pour texte simple - Extensible selon OCP
 */

export class TextSanitizer extends BaseSanitizer {
  private dangerousChars: string[]

  constructor(dangerousChars?: string[], maxLength?: number) {
    super(maxLength)
    this.dangerousChars = dangerousChars || ['<', '>', '"', "'", '&']
  }

  sanitize(input: string): string {
    if (!this.isValidInput(input)) return ''

    let sanitized = input.trim()

    // Supprimer les caractères dangereux
    const dangerousRegex = new RegExp(`[${this.dangerousChars.map(char => '\\' + char).join('')}]`, 'g')
    sanitized = sanitized.replace(dangerousRegex, '')

    return this.truncate(sanitized)
  }

  /**
   * Ajouter de nouveaux caractères dangereux
   */
  addDangerousChar(char: string): this {
    if (!this.dangerousChars.includes(char)) {
      this.dangerousChars.push(char)
    }
    return this
  }
}