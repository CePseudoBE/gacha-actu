import { HeroButton } from "@/types/hero"

interface HeroContentProps {
  title: string
  subtitle: string
  buttons: HeroButton[]
}

export function HeroContent({ title, subtitle, buttons }: HeroContentProps) {
  return (
    <div className="flex-1 text-foreground font-[family-name:var(--font-source-sans-3)]">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        {title}
      </h1>
      <p className="text-xl md:text-xl font-bold max-w-lg leading-relaxed text-muted-foreground mb-8">
        {subtitle}
      </p>
      
      {/* Buttons */}
      <div className="flex gap-4">
        {buttons.map((button) => (
          <button
            key={button.id}
            className={`px-6 py-3 border-2 font-bold rounded-lg transition-colors duration-300 ${
              button.variant === 'primary'
                ? 'border-primary text-primary hover:border-primary/80 hover:text-primary/80'
                : 'border-accent text-accent hover:border-accent/80 hover:text-accent/80'
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}