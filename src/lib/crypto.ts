import bcrypt from 'bcryptjs'

/**
 * Service de cryptographie pour les mots de passe
 * Responsabilité unique : gestion sécurisée des hash
 */

const SALT_ROUNDS = 12

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateTimingAttackProtection = async (): Promise<void> => {
  // Hash dummy pour éviter les timing attacks
  await bcrypt.compare('dummy', '$2a$12$dummy.hash.to.prevent.timing.attacks')
}