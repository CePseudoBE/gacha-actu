import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-background to-card overflow-hidden">
      {/* Background images for mobile - subtle overlay */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40 z-10" />
        <div className="flex h-full">
          <div className="flex-1 relative">
            <Image
              src="/img/7ds.jpg"
              alt="Seven Deadly Sins Origins - Artwork officiel du jeu mobile"
              fill
              className="object-cover object-center opacity-30"
              sizes="50vw"
            />
          </div>
          <div className="flex-1 relative">
            <Image
              src="/img/bsr.jpg"
              alt="Bleach Soul Resonance - Artwork officiel du jeu mobile"
              fill
              className="object-cover object-center opacity-30"
              sizes="50vw"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 h-full relative z-20">
        <div className="flex items-center justify-between h-full min-h-[80vh] gap-12">
          {/* Left side - Title and text */}
          <div className="flex-1 text-foreground font-[family-name:var(--font-source-sans-3)]">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Par un fan, pour les fans.
            </h1>
            <p className="text-xl md:text-xl font-bold max-w-lg leading-relaxed text-muted-foreground mb-8">
              La source numéro une de l&apos;actualité des jeux mobile et multi-plateformes. Bleach Soul Resonance, 7DS Origins et d&apos;autres.
            </p>
            
            {/* Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:border-primary/80 hover:text-primary/80 transition-colors duration-300">
                Actus
              </button>
              <button className="px-6 py-3 border-2 border-accent text-accent font-bold rounded-lg hover:border-accent/80 hover:text-accent/80 transition-colors duration-300">
                À venir
              </button>
            </div>

            {/* Partenaires */}
            <div className="mt-6">
              {/* Mobile - Icônes côte à côte */}
              <div className="lg:hidden flex gap-4 items-center">
                <Link 
                  href="https://leap.ldplayer.gg/T4DYBI9Ic"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src="/icons/ldplayer.svg"
                    alt="LDPlayer - Émulateur Android pour PC"
                    width={48}
                    height={48}
                  />
                </Link>
                <Link 
                  href="https://fr.gamesplanet.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src="/icons/gamesplanetsmall.png"
                    alt="Gamesplanet - Boutique de jeux PC"
                    width={48}
                    height={48}
                  />
                </Link>
              </div>
              
              {/* Desktop - Logos côte à côte */}
              <div className="hidden lg:flex gap-6 items-center">
                <Link 
                  href="https://leap.ldplayer.gg/T4DYBI9Ic"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src="https://res.ldrescdn.com/ldplayer-official/static/image/home/btn/down-fr.svg?url"
                    alt="Télécharger LDPlayer - Émulateur Android pour PC"
                    width={200}
                    height={60}
                  />
                </Link>
                <Link 
                  href="https://fr.gamesplanet.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src="/icons/gamsplanetbig.svg"
                    alt="Gamesplanet - Boutique de jeux PC"
                    width={200}
                    height={32}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop images */}
          <div className="hidden lg:flex gap-6 items-center">
            <div className="relative">
              <div className="w-56 h-[28rem] rounded-2xl shadow-2xl transform rotate-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <Image
                  src="/img/7ds.jpg"
                  alt="Seven Deadly Sins Origins - Artwork officiel du jeu mobile Gacha"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 1024px) 0vw, 224px"
                  priority
                />
              </div>
            </div>
            <div className="relative">
              <div className="w-56 h-[28rem] rounded-2xl shadow-2xl transform rotate-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <Image
                  src="/img/bsr.jpg"
                  alt="Bleach Soul Resonance - Artwork officiel du jeu mobile Gacha"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 1024px) 0vw, 224px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}