import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dash/', '/auth/'],
    },
    sitemap: 'https://thevoiceroom.co.ke/sitemap.xml',
  }
}
