import { PrismaClient } from '@prisma/client'
import { createUser } from '../src/lib/auth'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔧 Création de l\'administrateur...')
    
    // Créer l'utilisateur admin de test
    const admin = await createUser({
      email: 'admin@test.com',
      password: 'password123',
      name: 'Admin Test'
    })

    if (!admin) {
      console.error('❌ Erreur lors de la création de l\'admin')
      return
    }

    // Promouvoir en admin
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'admin' }
    })

    console.log('✅ Administrateur créé avec succès!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Mot de passe: password123')
    console.log('🛡️  Rôle: admin')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()