// Configuration sécurisée avec variables d'environnement

export const config = {
  // Configuration de l'environnement
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Configuration de la base de données
  database: {
    url: process.env.DATABASE_URL || '',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  },

  // Configuration de sécurité
  security: {
    // Clé secrète pour les JWT (À IMPLÉMENTER)
    jwtSecret: process.env.JWT_SECRET || '',
    
    // Configuration du rate limiting
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      adminMaxRequests: parseInt(process.env.ADMIN_RATE_LIMIT_MAX_REQUESTS || '50'),
    },

    // Configuration CORS
    cors: {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },

    // Configuration des sessions (À IMPLÉMENTER)
    session: {
      secret: process.env.SESSION_SECRET || '',
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400'), // 24 heures
    },

    // Longueurs maximales pour prévenir les attaques
    maxLengths: {
      title: 200,
      slug: 100,
      summary: 500,
      content: 50000, // 50KB pour le contenu Markdown
      author: 100,
      metaDescription: 160,
      tagName: 50,
      seoKeyword: 100,
      maxTags: 10,
      maxSeoKeywords: 20,
    },

    // URLs autorisées pour les images
    allowedImageDomains: [
      'images.unsplash.com',
      'unsplash.com',
      'cdn.example.com', // Remplacer par votre CDN
      // Ajouter d'autres domaines de confiance
    ],
  },

  // Configuration de l'application
  app: {
    name: 'GachaActu',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    adminPath: '/admin',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  },

  // Configuration des logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableSecurityLogs: process.env.ENABLE_SECURITY_LOGS === 'true',
  },
}

// Validation de la configuration au démarrage
export function validateConfig() {
  const errors: string[] = []

  if (config.isProduction) {
    if (!config.security.jwtSecret) {
      errors.push('JWT_SECRET is required in production')
    }
    
    if (!config.security.session.secret) {
      errors.push('SESSION_SECRET is required in production')
    }
    
    if (!config.database.url) {
      errors.push('DATABASE_URL is required')
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`)
  }
}

// Utilitaires de configuration
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return config.security.allowedImageDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}

export const getMaxLength = (field: keyof typeof config.security.maxLengths): number => {
  return config.security.maxLengths[field]
}