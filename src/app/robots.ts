import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/admin/',
        '/api/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://gachaactu.com/sitemap.xml',
    host: 'https://gachaactu.com',
  }
}