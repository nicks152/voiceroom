export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Voice Room",
    "alternateName": "The Voice Room by AMP Studios",
    "url": "https://thevoiceroom.co.ke",
    "logo": "https://thevoiceroom.co.ke/images/logo.png",
    "description": "A hand-picked roster of Africa focused voice artists, carefully selected for the world's most discerning productions.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nairobi",
      "addressCountry": "KE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-790-491-934",
      "contactType": "customer service",
      "email": "voices@ampafrica.com",
      "availableLanguage": ["English", "Swahili"]
    },
    "sameAs": [
      "https://www.instagram.com/thevoiceroomke",
      "https://www.linkedin.com/company/amp-studios-kenya"
    ]
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://thevoiceroom.co.ke/#business",
    "name": "The Voice Room",
    "image": "https://thevoiceroom.co.ke/images/og-image.jpg",
    "description": "Premium voiceover recording and casting studio in Nairobi. Access top African voice talent for commercials, content, ADR, and IVR.",
    "url": "https://thevoiceroom.co.ke",
    "telephone": "+254790491934",
    "email": "voices@ampafrica.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.2921,
      "longitude": 36.8219
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "areaServed": [
      { "@type": "Country", "name": "Kenya" },
      { "@type": "Continent", "name": "Africa" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "United States" }
    ],
    "serviceType": [
      "Voiceover Recording",
      "Voice Casting",
      "Voice Direction",
      "ADR Recording",
      "IVR Production",
      "Dubbing",
      "Localisation"
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Voiceover Services",
    "provider": {
      "@type": "Organization",
      "name": "The Voice Room"
    },
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Voiceover Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Voice Casting",
            "description": "Curated voice casting tailored to your project with access to African voice talent."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Voiceover Recording",
            "description": "Professional in-studio recording at AMP Studios in Nairobi."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ADR Recording",
            "description": "Dialogue recording for film and post-production."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "IVR Production",
            "description": "Voice and production for phone systems and automated experiences."
          }
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}
