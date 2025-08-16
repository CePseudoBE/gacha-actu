/**
 * Interface pour le service de cryptographie (DIP)
 */

export interface ICryptoService {
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>
  generateTimingAttackProtection(): Promise<void>
}

/**
 * Implémentation bcrypt du service de cryptographie
 */
export class BcryptService implements ICryptoService {
  private saltRounds: number

  constructor(saltRounds: number = 12) {
    this.saltRounds = saltRounds
  }

  async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs')
    return bcrypt.default.hash(password, this.saltRounds)
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs')
    return bcrypt.default.compare(password, hashedPassword)
  }

  async generateTimingAttackProtection(): Promise<void> {
    const bcrypt = await import('bcryptjs')
    await bcrypt.default.compare('dummy', '$2a$12$dummy.hash.to.prevent.timing.attacks')
  }
}