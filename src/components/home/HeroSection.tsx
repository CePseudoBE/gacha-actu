import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-black to-[#051202]">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full min-h-[80vh] gap-12">
          {/* Left side - Title and text */}
          <div className="flex-1 text-gray-500 font-[family-name:var(--font-source-sans-3)]">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Par un fan, pour les fans.
            </h1>
            <p className="text-xl md:text-xl font-bold max-w-lg leading-relaxed text-gray-600 mb-8">
              La source numéro une de l'actualité des jeux mobile et multi-plateformes. Bleach Soul Resonance, 7DS Origins et d'autres.
            </p>
            
            {/* Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 border-2 border-gray-500 text-gray-500 font-bold rounded-lg hover:border-gray-400 hover:text-gray-400 transition-colors duration-300">
                Actus
              </button>
              <button className="px-6 py-3 border-2 border-gray-500 text-gray-500 font-bold rounded-lg hover:border-gray-400 hover:text-gray-400 transition-colors duration-300">
                À venir
              </button>
            </div>
          </div>

          <div className="hidden lg:flex gap-6 items-center">
            <div className="relative">
              <div className="w-56 h-[28rem] rounded-2xl shadow-2xl transform rotate-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <Image
                  src="/img/7ds.jpg"
                  alt="Seven Deadly Sins"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="relative">
              <div className="w-56 h-[28rem] rounded-2xl shadow-2xl transform rotate-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <Image
                  src="/img/bsr.jpg"
                  alt="Bleach Soul Resonance"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}