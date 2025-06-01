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
  Query,
  ParseIntPipe,
  DefaultValuePipe,
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

  @Get('paginated')
  async findAllPaginated(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const userId = req.user.id;
    return this.applicationService.findAllPaginated(userId, {
      page,
      perPage,
    });
  }

  @Get("all")
  findAllApplications() {
    return this.applicationService.findAllApplications();
  }

  @Get('check/:schoolId')
  checkApplication(@Param('schoolId', ParseUUIDPipe) schoolId: string, @Request() req) {
    const userId = req.user.id;
    return this.applicationService.checkApplication(userId, schoolId);
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
