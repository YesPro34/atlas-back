import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("🔍 RefreshAuthGuard - Request received");
    console.log("🔍 RefreshAuthGuard - All cookies:", request.cookies);
    console.log("🔍 RefreshAuthGuard - Request headers:", request.headers);
    
    const refreshToken = request.cookies?.refresh_token;
    console.log("🔍 RefreshAuthGuard - Refresh token from cookie:", refreshToken ? "EXISTS" : "NOT FOUND");

    if (!refreshToken) {
      console.log("❌ RefreshAuthGuard - No refresh token found in cookies");
      throw new UnauthorizedException('No refresh token');
    }

    try {
      console.log("🔍 RefreshAuthGuard - Attempting to verify refresh token");
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_JWT_SECRET,
      });
      console.log("✅ RefreshAuthGuard - Token verified successfully, payload:", payload);

      request.user = { id: payload.sub };
      request.refreshToken = refreshToken;
      console.log("✅ RefreshAuthGuard - User set in request:", request.user);
      return true;
    } catch (e) {
      console.log("❌ RefreshAuthGuard - Token verification failed:", e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
