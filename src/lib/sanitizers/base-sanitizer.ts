/**
 * Interfaces spécialisées respectant LSP
 */

export interface ISanitizer<T = string> {
  sanitize(input: string): T
  isValidInput(input: string): boolean
}

export interface IStringSanitizer extends ISanitizer<string> {
  sanitize(input: string): string
}

export interface INullableStringSanitizer extends ISanitizer<string | null> {
  sanitize(input: string): string | null
}

export abstract class BaseSanitizer implements IStringSanitizer {
  protected maxLength: number = 1000

  constructor(maxLength?: number) {
    if (maxLength) {
      this.maxLength = maxLength
    }
  }

  abstract sanitize(input: string): string

  isValidInput(input: string): boolean {
    return typeof input === 'string' && input.trim().length > 0
  }

  protected truncate(input: string): string {
    return input.substring(0, this.maxLength)
  }
}

export abstract class BaseNullableSanitizer implements INullableStringSanitizer {
  abstract sanitize(input: string): string | null

  isValidInput(input: string): boolean {
    return typeof input === 'string' && input.trim().length > 0
  }
}