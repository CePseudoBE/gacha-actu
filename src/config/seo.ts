export const homePageSeo = {
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GachaActu",
    "description": "Le site d'actualités spécialisé dans les jeux Gacha",
    "url": "https://gachaactu.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gachaactu.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Organization",
      "name": "GachaActu"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "GachaActu"
    }
  }
}