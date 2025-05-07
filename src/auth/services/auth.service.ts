import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthDomainService } from './domain/auth.domain.service';
import { UserService } from 'src/user/services/user.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDomainService: AuthDomainService,
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService, // Assuming you have a UserService to fetch user details
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByMassarCode(loginDto.massarCode);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (user.status === 'INACTIVE') {
      throw new UnauthorizedException('Votre compte est désactivé.');
    }

    const isValidPassword = await this.authDomainService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.authDomainService.generateToken(user.id, user.role);
    const expiresAt = this.authDomainService.calculateSessionExpiry();
    await this.authRepository.createSession(user.id, token, expiresAt);
    const { password, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async refreshToken(userId: string, role: string) {
    const session = await this.authRepository.findSessionByUserId(userId);
    this.authDomainService.validateSession(session);

    const newToken = this.authDomainService.generateToken(userId, role);
    const expiresAt = this.authDomainService.calculateSessionExpiry();
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await this.authRepository.updateSession(session.id, newToken, expiresAt);

    return { token: newToken };
  }

  async logout(userId: string) {
    await this.authRepository.deleteSessionsByUserId(userId);
    return { message: 'Successfully logged out' };
  }
}
