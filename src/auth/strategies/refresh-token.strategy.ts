import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import type { AuthJwtPayload } from '../types/auth-jwtPayload';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.refresh_token;
        },
      ]),
      secretOrKey: refreshTokenConfig.secret as string,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  // request.user
  validate(req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.cookies?.refresh_token;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
