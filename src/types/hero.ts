export interface PartnerLink {
  id: string
  name: string
  href: string
  logo: {
    desktop: string
    mobile: string
  }
  alt: string
  dimensions: {
    desktop: { width: number; height: number }
    mobile: { width: number; height: number }
  }
}

export interface HeroButton {
  id: string
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

export interface HeroImage {
  src: string
  alt: string
  priority?: boolean
}

export interface HeroContent {
  title: string
  subtitle: string
  buttons: HeroButton[]
  partners: PartnerLink[]
  images: {
    desktop: HeroImage[]
    mobile: HeroImage[]
  }
}

export interface HeroSectionProps {
  content: HeroContent
}