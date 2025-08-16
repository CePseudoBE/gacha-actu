import { BaseNullableSanitizer } from './base-sanitizer'

/**
 * Sanitizer pour URLs - Extensible selon OCP
 */

export class UrlSanitizer extends BaseNullableSanitizer {
  private allowedProtocols: string[]

  constructor(allowedProtocols?: string[]) {
    super()
    this.allowedProtocols = allowedProtocols || ['http:', 'https:']
  }

  sanitize(input: string): string | null {
    if (!this.isValidInput(input)) return null

    try {
      const url = new URL(input.trim())
      
      if (!this.allowedProtocols.includes(url.protocol)) {
        return null
      }

      return url.toString()
    } catch {
      return null
    }
  }

  /**
   * Ajouter un nouveau protocole autorisé
   */
  addAllowedProtocol(protocol: string): this {
    if (!this.allowedProtocols.includes(protocol)) {
      this.allowedProtocols.push(protocol)
    }
    return this
  }
}