// Extension des types NextAuth pour notre application

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'admin' | 'editor' | 'user'
      isActive: boolean
      image?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'admin' | 'editor' | 'user'
    isActive: boolean
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: 'admin' | 'editor' | 'user'
    isActive: boolean
  }
}