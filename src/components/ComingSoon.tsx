import { Calendar, Wrench, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getLaunchDate } from '@/lib/coming-soon'

interface ComingSoonProps {
  pageName: string
  description?: string
}

export default function ComingSoon({ 
  pageName, 
  description = "Cette section est en cours de développement par notre équipe." 
}: ComingSoonProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#051202] p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <Wrench className="w-12 h-12 text-black" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
                <Calendar className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {pageName}
          </h1>
          
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            {description}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">Lancement prévu</h2>
          </div>
          
          <p className="text-2xl font-bold text-green-400 mb-4">
            {getLaunchDate()}
          </p>
          
          <p className="text-gray-300 mb-6">
            En attendant, découvrez les dernières actualités et rejoignez notre communauté !
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
            
            <a
              href="https://discord.gg/gachaactu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.037c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
              </svg>
              Rejoindre Discord
            </a>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Une question ? Contactez-nous
          </p>
          <p className="text-xs text-gray-600">
            support@animegachapulse.com
          </p>
        </div>
      </div>
    </div>
  )
}