import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyCredentials } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Utilitaire pour récupérer un utilisateur depuis la DB
const getUserFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id }
  })
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    image: user.image
  }
}

const authOptions = {
  // Stratégie JWT avec gestion manuelle des sessions en DB
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    updateAge: 24 * 60 * 60, // Met à jour toutes les 24h
  },

  // Configuration des providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Connexion",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "votre@email.com"
        },
        password: {
          label: "Mot de passe",
          type: "password",
          placeholder: "••••••••"
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        // Utiliser notre fonction de vérification personnalisée
        const user = await verifyCredentials({
          email: credentials.email,
          password: credentials.password
        })

        if (!user) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // Retourner l'utilisateur pour NextAuth
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive
        }
      }
    })
  ],

  // Callbacks pour JWT avec sessions en DB
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      // Lors de la connexion, user contient les données du provider
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isActive = user.isActive
        
        // Ne pas créer de sessions supplémentaires - NextAuth gère déjà les JWT
        // Les sessions en DB sont créées seulement via l'auth-middleware si besoin
      }
      return token
    },

    async session({ session, token }: { session: any; token: any }) {
      // Récupérer les données utilisateur fraîches depuis la DB
      if (token.id) {
        const freshUser = await getUserFromDB(token.id as string)
        if (freshUser) {
          session.user.id = freshUser.id
          session.user.role = freshUser.role as 'admin' | 'editor' | 'user'
          session.user.isActive = freshUser.isActive
        }
      } else if (token.role) {
        // Fallback: utiliser les données du token directement
        session.user.id = token.sub!
        session.user.role = token.role as 'admin' | 'editor' | 'user'
        session.user.isActive = token.isActive as boolean
      }
      
      
      return session
    },

    async signIn({ user }: { user: any; account?: any; profile?: any }) {
      // Vérifier si l'utilisateur peut se connecter
      if (user && !user.isActive) {
        throw new Error("Compte désactivé")
      }
      return true
    }
  },

  // Pages personnalisées
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },

  // Configuration des cookies
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },


  // Debug en développement
  debug: process.env.NODE_ENV === 'development',

  // Secret pour signer les tokens
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = (NextAuth as any)(authOptions)

export { handler as GET, handler as POST }