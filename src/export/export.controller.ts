import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('applications/school/:schoolId')
  @Roles("ADMIN")
  async exportStudentApplications(
    @Param('schoolId') schoolId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportStudentApplicationsBySchool(
      schoolId
    );

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="student-applications-school-${schoolId}.xlsx"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
} 