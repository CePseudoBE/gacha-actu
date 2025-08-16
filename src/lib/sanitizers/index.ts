/**
 * Factory de sanitizers - Respecte OCP
 * Permet d'ajouter de nouveaux sanitizers sans modifier le code existant
 */

export { BaseSanitizer, BaseNullableSanitizer } from './base-sanitizer'
export type { ISanitizer, IStringSanitizer, INullableStringSanitizer } from './base-sanitizer'
export { HtmlSanitizer } from './html-sanitizer'
export { TextSanitizer } from './text-sanitizer'
export { UrlSanitizer } from './url-sanitizer'
export { SlugSanitizer } from './slug-sanitizer'

import { HtmlSanitizer } from './html-sanitizer'
import { TextSanitizer } from './text-sanitizer'
import { UrlSanitizer } from './url-sanitizer'
import { SlugSanitizer } from './slug-sanitizer'

// Factory pour créer des instances configurées
export class SanitizerFactory {
  static createHtmlSanitizer(options?: {
    allowedTags?: string[]
    allowedAttributes?: string[]
    maxLength?: number
  }): HtmlSanitizer {
    return new HtmlSanitizer(
      options?.allowedTags,
      options?.allowedAttributes,
      options?.maxLength
    )
  }

  static createTextSanitizer(options?: {
    dangerousChars?: string[]
    maxLength?: number
  }): TextSanitizer {
    return new TextSanitizer(
      options?.dangerousChars,
      options?.maxLength
    )
  }

  static createUrlSanitizer(allowedProtocols?: string[]): UrlSanitizer {
    return new UrlSanitizer(allowedProtocols)
  }

  static createSlugSanitizer(maxLength?: number): SlugSanitizer {
    return new SlugSanitizer(maxLength)
  }
}

// Instances par défaut pour compatibilité - Respecte le pattern Singleton
class DefaultSanitizers {
  private static htmlInstance: HtmlSanitizer
  private static textInstance: TextSanitizer
  private static urlInstance: UrlSanitizer
  private static slugInstance: SlugSanitizer

  static getHtmlSanitizer(): HtmlSanitizer {
    if (!this.htmlInstance) {
      this.htmlInstance = SanitizerFactory.createHtmlSanitizer()
    }
    return this.htmlInstance
  }

  static getTextSanitizer(): TextSanitizer {
    if (!this.textInstance) {
      this.textInstance = SanitizerFactory.createTextSanitizer()
    }
    return this.textInstance
  }

  static getUrlSanitizer(): UrlSanitizer {
    if (!this.urlInstance) {
      this.urlInstance = SanitizerFactory.createUrlSanitizer()
    }
    return this.urlInstance
  }

  static getSlugSanitizer(): SlugSanitizer {
    if (!this.slugInstance) {
      this.slugInstance = SanitizerFactory.createSlugSanitizer()
    }
    return this.slugInstance
  }
}

// Interface publique pour compatibilité - Respecte le pattern Facade
export const sanitize = {
  html: (input: string): string => DefaultSanitizers.getHtmlSanitizer().sanitize(input),
  text: (input: string): string => DefaultSanitizers.getTextSanitizer().sanitize(input),
  url: (input: string): string | null => DefaultSanitizers.getUrlSanitizer().sanitize(input),
  slug: (input: string): string => DefaultSanitizers.getSlugSanitizer().sanitize(input)
}