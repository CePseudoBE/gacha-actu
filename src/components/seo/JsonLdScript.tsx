interface JsonLdData {
  "@context": string
  "@type": string
  [key: string]: unknown
}

interface JsonLdScriptProps {
  data: JsonLdData
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}