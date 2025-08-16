/**
 * Repository pattern avec DIP
 * Abstraction pour la persistance des utilisateurs
 */

import { PrismaClient } from '@prisma/client'

export interface UserRecord {
  id: string
  email: string
  name: string
  password: string
  role: string
  isActive: boolean
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserRecord | null>
  findById(id: string): Promise<UserRecord | null>
  create(userData: Omit<UserRecord, 'id'>): Promise<UserRecord>
  updateRole(id: string, role: string): Promise<void>
  updateActiveStatus(id: string, isActive: boolean): Promise<void>
}

/**
 * Implémentation Prisma du repository
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  async findById(id: string): Promise<UserRecord | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    })
  }

  async create(userData: Omit<UserRecord, 'id'>): Promise<UserRecord> {
    return await this.prisma.user.create({
      data: userData
    })
  }

  async updateRole(id: string, role: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { role }
    })
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive }
    })
  }
}