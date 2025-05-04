import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthDomainService {
  constructor(private jwtService: JwtService) {}

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  generateToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  calculateSessionExpiry(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    return expiresAt;
  }

  validateSession(session: { expiresAt: Date } | null): void {
    if (!session) {
      throw new UnauthorizedException('No valid session found');
    }
  }
}
