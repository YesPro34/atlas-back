import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
