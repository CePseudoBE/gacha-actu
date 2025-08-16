import DOMPurify from 'isomorphic-dompurify'
import { BaseSanitizer } from './base-sanitizer'

/**
 * Sanitizer HTML - Extensible selon OCP
 */

export class HtmlSanitizer extends BaseSanitizer {
  private allowedTags: string[]
  private allowedAttributes: string[]

  constructor(
    allowedTags?: string[],
    allowedAttributes?: string[],
    maxLength?: number
  ) {
    super(maxLength)
    
    this.allowedTags = allowedTags || [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
    ]
    
    this.allowedAttributes = allowedAttributes || []
  }

  sanitize(input: string): string {
    if (!this.isValidInput(input)) return ''

    const sanitized = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: this.allowedTags,
      ALLOWED_ATTR: this.allowedAttributes
    })

    return this.truncate(sanitized)
  }

  /**
   * Méthode pour étendre les tags autorisés
   */
  addAllowedTag(tag: string): this {
    if (!this.allowedTags.includes(tag)) {
      this.allowedTags.push(tag)
    }
    return this
  }

  /**
   * Méthode pour étendre les attributs autorisés
   */
  addAllowedAttribute(attr: string): this {
    if (!this.allowedAttributes.includes(attr)) {
      this.allowedAttributes.push(attr)
    }
    return this
  }
}