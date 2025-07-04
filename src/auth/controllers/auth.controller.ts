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
    console.log("🔐 Login endpoint called");
    console.log("🔐 Login - Request body:", req.body);
    
    const { id, massarCode, role, bacOption, accessToken, refreshToken } =
      await this.authService.login(
        req.user.id,
        req.user.massarCode,
        req.user.role,
        req.user.bacOption,
      );

    console.log("🔐 Login - Tokens generated, setting refresh token cookie");
    console.log("🔐 Login - Refresh token value (first 20 chars):", refreshToken.substring(0, 20) + "...");
    
    // Set HTTP-only cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // Required for cross-origin requests
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("✅ Login - Refresh token cookie set successfully");
    console.log("🔐 Login - Cookie details:", {
      name: 'refresh_token',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // Log the Set-Cookie header that should be sent
    console.log("🔐 Login - Set-Cookie header should be: refresh_token=...; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800");

    const response = {
      id,
      massarCode,
      role,
      bacOption,
      accessToken,
    };
    console.log("✅ Login - Returning response:", { id, massarCode, role, bacOption, accessToken: "***" });
    return response;
  }

  @Roles('STUDENT')
  @Get('protected')
  getAll(@Request() req) {
    return {
      messege: `Now you can access this protected API. this is your user ID: ${req.user.id}`,
    };
  }

  @Public()
  @Get('test-cookies')
  async testCookies(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log("🧪 Test cookies endpoint called");
    console.log("🧪 Test cookies - Request cookies:", req.cookies);
    console.log("🧪 Test cookies - Request headers:", req.headers);
    
    // Set a test cookie
    res.cookie('test_cookie', 'test_value', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 1000, // 1 minute
    });
    
    return {
      message: "Test cookie set",
      receivedCookies: req.cookies,
      refreshTokenExists: !!req.cookies?.refresh_token
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log("🔄 Refresh endpoint called");
    console.log("🔄 Refresh - Request cookies:", req.cookies);
    console.log("🔄 Refresh - Request headers:", req.headers);
    
    const userId = req.user.id;
    const refreshToken = req.refreshToken; // set in guard
    console.log("🔄 Refresh - User ID from guard:", userId);
    console.log("🔄 Refresh - Refresh token from guard:", refreshToken ? "EXISTS" : "NOT FOUND");
    
    // Always fetch massarCode from userService
    const user = await this.authService.findUserById(userId);
    if (!user) {
      console.log("❌ Refresh - User not found for ID:", userId);
      throw new Error('User not found');
    }
    const massarCode = user.massarCode;
    console.log("🔄 Refresh - Found user with massarCode:", massarCode);

    console.log("🔄 Refresh - Calling authService.refreshToken");
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(userId, massarCode);
    console.log("✅ Refresh - New tokens generated successfully");

    // Re-set new refresh token in cookie
    console.log("🔄 Refresh - Setting new refresh token in cookie");
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("✅ Refresh - Cookie set successfully");
    console.log("🔄 Refresh - Cookie details:", {
      name: 'refresh_token',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const response = {
      id: userId,
      massarCode,
      accessToken,
    };
    console.log("✅ Refresh - Returning response:", { id: userId, massarCode, accessToken: "***" });
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logOut(@Request() req) {
    return this.authService.logOut(req.user.id);
  }
}
