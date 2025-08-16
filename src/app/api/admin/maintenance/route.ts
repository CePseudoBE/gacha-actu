import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { addSecurityHeaders, validateAndSanitize, SecurityError } from '@/lib/security'
import { z } from 'zod'

const maintenanceSchema = z.object({
  isEnabled: z.boolean(),
  message: z.string().min(1).max(500),
  estimatedEndTime: z.string().datetime().optional(),
  allowAdminAccess: z.boolean().default(true)
})

// GET - Récupérer les paramètres de maintenance
async function handleGET(_request: NextRequest, _user: unknown) {
  try {
    let settings = await prisma.maintenanceSettings.findUnique({
      where: { id: 'singleton' }
    })

    // Créer les paramètres par défaut si ils n'existent pas
    if (!settings) {
      settings = await prisma.maintenanceSettings.create({
        data: {
          id: 'singleton',
          isEnabled: false,
          message: 'Site en maintenance. Nous reviendrons bientôt !',
          allowAdminAccess: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres de maintenance:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour les paramètres de maintenance
async function handlePUT(request: NextRequest, user: any) {
  try {
    const body = await request.json()
    
    // Validation et sanitisation
    const validatedData = validateAndSanitize(body, (data) => {
      const result = maintenanceSchema.safeParse(data)
      if (!result.success) {
        throw new SecurityError('Données invalides', 'VALIDATION_ERROR', 400)
      }
      return result.data
    })

    // Convertir la date si fournie
    const estimatedEndTime = validatedData.estimatedEndTime 
      ? new Date(validatedData.estimatedEndTime)
      : null

    // Mettre à jour ou créer les paramètres
    const settings = await prisma.maintenanceSettings.upsert({
      where: { id: 'singleton' },
      update: {
        isEnabled: validatedData.isEnabled,
        message: validatedData.message,
        estimatedEndTime,
        allowAdminAccess: validatedData.allowAdminAccess,
        enabledBy: validatedData.isEnabled ? user.id : null,
        disabledBy: !validatedData.isEnabled ? user.id : null,
        updatedAt: new Date()
      },
      create: {
        id: 'singleton',
        isEnabled: validatedData.isEnabled,
        message: validatedData.message,
        estimatedEndTime,
        allowAdminAccess: validatedData.allowAdminAccess,
        enabledBy: validatedData.isEnabled ? user.id : null,
        disabledBy: !validatedData.isEnabled ? user.id : null
      }
    })

    const action = validatedData.isEnabled ? 'activé' : 'désactivé'
    console.log(`Mode maintenance ${action} par ${user.email}`)

    return NextResponse.json({
      success: true,
      message: `Mode maintenance ${action} avec succès`,
      data: settings
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la maintenance:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// API publique pour vérifier le statut de maintenance (sans auth)
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.maintenanceSettings.findUnique({
      where: { id: 'singleton' },
      select: {
        isEnabled: true,
        message: true,
        estimatedEndTime: true,
        allowAdminAccess: true
      }
    })

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: {
          isEnabled: false,
          message: 'Site en maintenance. Nous reviendrons bientôt !',
          estimatedEndTime: null,
          allowAdminAccess: true
        }
      })
    }

    return addSecurityHeaders(NextResponse.json({
      success: true,
      data: settings
    }))
  } catch (error) {
    console.error('Erreur lors de la vérification du statut de maintenance:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Routes protégées pour admin
export const PUT = requireAdminAuth(handlePUT)