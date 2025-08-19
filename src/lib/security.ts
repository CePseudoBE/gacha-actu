import { NextRequest, NextResponse } from 'next/server'
import { sanitize } from './sanitizers/index'

// Interface pour les réponses d'erreur sécurisées
interface SecureErrorResponse {
  error: string
  code?: string
  timestamp: string
}

// Classe pour la gestion des erreurs sécurisées
export class SecurityError extends Error {
  public code: string
  public statusCode: number

  constructor(message: string, code: string = 'SECURITY_ERROR', statusCode: number = 403) {
    super(message)
    this.name = 'SecurityError'
    this.code = code
    this.statusCode = statusCode
  }
}

// Réexport des sanitizers pour compatibilité
export { sanitize, SanitizerFactory } from './sanitizers/index'

// Validation des taux de limitation (Rate Limiting)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export const rateLimit = {
  check: (identifier: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean => {
    const now = Date.now()
    const record = rateLimitMap.get(identifier)

    if (!record || now - record.lastReset > windowMs) {
      rateLimitMap.set(identifier, { count: 1, lastReset: now })
      return true
    }

    if (record.count >= limit) {
      return false
    }

    record.count++
    return true
  },

  getIdentifier: (request: NextRequest): string => {
    // En production, utiliser l'IP réelle derrière le proxy
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    return ip
  }
}

// Middleware de sécurité pour les routes admin
export const requireAdminAuth = (handler: (request: NextRequest) => Promise<NextResponse>) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Vérification d'authentification via cookie de session
      const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                          request.cookies.get('__Secure-next-auth.session-token')?.value

      if (!sessionToken) {
        throw new SecurityError('Authentification requise', 'AUTH_REQUIRED', 401)
      }

      // Rate limiting pour les routes admin
      const identifier = rateLimit.getIdentifier(request)
      if (!rateLimit.check(identifier, 50, 15 * 60 * 1000)) {
        throw new SecurityError('Trop de requêtes', 'RATE_LIMIT_EXCEEDED', 429)
      }

      return await handler(request)
    } catch (error) {
      return handleSecurityError(error)
    }
  }
}

// Gestion sécurisée des erreurs
export const handleSecurityError = (error: unknown): NextResponse => {
  // Log sécurisé : pas d'informations sensibles en production
  if (process.env.NODE_ENV === 'development') {
    console.error('Security error:', error)
  } else {
    // En production, log uniquement le type d'erreur
    console.error('Security error occurred:', error instanceof SecurityError ? error.code : 'UNKNOWN_ERROR')
  }

  const secureResponse: SecureErrorResponse = {
    error: 'Accès refusé',
    timestamp: new Date().toISOString()
  }

  if (error instanceof SecurityError) {
    secureResponse.error = error.message
    secureResponse.code = error.code
    return NextResponse.json(secureResponse, { status: error.statusCode })
  }

  // Pour toute autre erreur, retourner une réponse générique
  return NextResponse.json(secureResponse, { status: 500 })
}

// Validation et sanitisation des données d'entrée
export const validateAndSanitize = <T>(
  data: unknown,
  validator: (data: unknown) => T
): T => {
  try {
    // Validation avec le schéma fourni (Zod)
    const validatedData = validator(data)

    // Sanitisation récursive des chaînes de caractères
    return sanitizeObject(validatedData) as T
  } catch {
    throw new SecurityError('Données invalides', 'VALIDATION_ERROR', 400)
  }
}

// Sanitisation récursive des objets
const sanitizeObject = (obj: unknown): unknown => {
  if (typeof obj === 'string') {
    return sanitize.text(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      // Sanitiser les clés aussi
      const cleanKey = sanitize.text(key)
      sanitized[cleanKey] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

// Headers de sécurité
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': process.env.NODE_ENV === 'production' 
    ? 'max-age=31536000; includeSubDomains; preload' 
    : '',
  'Content-Security-Policy': process.env.NODE_ENV === 'production'
    ? "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'sha256-' 'sha384-'; style-src 'self' 'sha256-'; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    : "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https: ws: wss:;",
}

// Utilitaire pour ajouter les headers de sécurité
export const addSecurityHeaders = (response: NextResponse): NextResponse => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) { // Ne pas ajouter les headers vides
      response.headers.set(key, value)
    }
  })
  
  // Header de sécurité supplémentaire pour éviter le sniffing de contenu
  response.headers.set('X-Powered-By', '') // Masquer Next.js
  
  // Empêcher la mise en cache des réponses d'erreur
  if (response.status >= 400) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
  
  return response
}