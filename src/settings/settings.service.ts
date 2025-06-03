import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getGradesFormAccess() {
    const setting = await this.prisma.settings.findFirst({
      where: { key: 'gradesFormEnabled' },
    });
    return setting?.value === 'true';
  }

  async setGradesFormAccess(enabled: boolean) {
    await this.prisma.settings.upsert({
      where: { key: 'gradesFormEnabled' },
      update: { value: String(enabled) },
      create: {
        key: 'gradesFormEnabled',
        value: String(enabled),
      },
    });
    return { enabled };
  }
} 