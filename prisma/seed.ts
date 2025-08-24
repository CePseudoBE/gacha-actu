import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed for production...')

  // Créer uniquement l'utilisateur admin
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123!@#', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gachactu.com' },
    update: {},
    create: {
      email: 'admin@gachactu.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date()
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 1 admin user (admin@gachactu.com)`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })