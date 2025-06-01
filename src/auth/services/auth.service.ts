import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { BacOption, Role } from '@prisma/client';
import { UserService } from 'src/user/services/user.service';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import refreshConfig from '../config/refresh.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async validateLocalUser(massarCode: string, password: string) {
    const user = await this.userService.findByMassarCode(massarCode);
    if (!user) throw new UnauthorizedException('User not found!');

    // Check if user is inactive
    if (user.status === 'INACTIVE') {
      throw new UnauthorizedException('Your account is inactive. Please contact the administrator.');
    }

    const studentBacOption = await this.userService.findBacOptionByUserId(
      user.id,
    );
    if (!studentBacOption)
      throw new UnauthorizedException('Bac option not found!');
    const isPasswordMatched = await compare(password, user.password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials!');

    return {
      id: user.id,
      massarCode: user.massarCode,
      role: user.role,
      bacOption: studentBacOption,
    };
  }

  async login(
    userId: string,
    massarCode: string,
    role: Role,
    bacOption: BacOption,
  ) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken, 10);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);
    return {
      id: userId,
      massarCode: massarCode,
      role,
      bacOption,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Refresh token not found!');
    }
    const refreshTokenMatched = await compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');
    return user;
  }

  async refreshToken(userId: string, massarCode: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken, 10);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);
    return {
      id: userId,
      massarCode: massarCode,
      accessToken,
      refreshToken,
    };
  }

  async logOut(userId: string) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}
