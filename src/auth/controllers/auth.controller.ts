import { Controller, Get, Post, Request, UseGuards, Res } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from '../guards/refresh-auth/refresh-auth.guard';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { id, massarCode, role, bacOption, accessToken, refreshToken } =
      await this.authService.login(
        req.user.id,
        req.user.massarCode,
        req.user.role,
        req.user.bacOption,
      );

    // Set HTTP-only cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // set to true in production
      sameSite: 'none', // cross-site cookies
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      id,
      massarCode,
      role,
      bacOption,
      accessToken,
    };
  }

  @Roles('STUDENT')
  @Get('protected')
  getAll(@Request() req) {
    return {
      messege: `Now you can access this protected API. this is your user ID: ${req.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.id;
    const refreshToken = req.refreshToken; // set in guard
    
    // Always fetch massarCode from userService
    const user = await this.authService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const massarCode = user.massarCode;

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(userId, massarCode);

    // Re-set new refresh token in cookie
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      id: userId,
      massarCode,
      accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logOut(@Request() req) {
    return this.authService.logOut(req.user.id);
  }
}
