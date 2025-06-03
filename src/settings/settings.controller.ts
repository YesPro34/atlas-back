import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('grades-form-access')
  async getGradesFormAccess() {
    return await this.settingsService.getGradesFormAccess();
  }

  @Post('grades-form-access')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async setGradesFormAccess(@Body('enabled') enabled: boolean) {
    return await this.settingsService.setGradesFormAccess(enabled);
  }
} 