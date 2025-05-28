import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import {
  CreateApplicationDto,
  UpdateApplicationChoicesDto,
  UpdateApplicationStatusDto,
} from '../dto/create-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    const userId = createApplicationDto.userId;
    return this.applicationService.create(userId, createApplicationDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.applicationService.findAll(userId);
  }

  @Get("all")
  findAllApplications() {
    return this.applicationService.findAllApplications();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/update')
  updateApplicationChoices(@Param('id', ParseUUIDPipe) id: string, @Body() updateApplicationChoicesDto: UpdateApplicationChoicesDto) {
    return this.applicationService.updateApplicationChoices(id, updateApplicationChoicesDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user.id;
    return this.applicationService.remove(id, userId);
  }
}
