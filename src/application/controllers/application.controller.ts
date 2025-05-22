import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from '../dto/create-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Body('userId') userId: string,
  ) {
    return this.applicationService.create(userId, createApplicationDto);
  }

  @Get()
  findAll(@Body('userId') userId: string) {
    return this.applicationService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.applicationService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.applicationService.remove(id, userId);
  }
}
