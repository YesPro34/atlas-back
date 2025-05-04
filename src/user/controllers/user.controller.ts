import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@Param('id') id: string) {
    return { message: 'User found', id };
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: any) {
    return { message: 'User updated', id, user };
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return { message: 'User deleted', id };
  }
}
