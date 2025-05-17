import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BacOption } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  // FIND USER BY HIS MASSAR CODE
  async findByMassarCode(massarCode: string) {
    return await this.userRepository.findByCodeMassar(massarCode);
  }

  // CREATE NEW USER
  async createUser(createUserDto: CreateUserDto) {
    // Check for existing user
    const existingUser = await this.userRepository.findByCodeMassar(
      createUserDto.massarCode,
    );
    if (existingUser) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Massar code already exists',
      });
    }
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 is salt rounds
      const userToCreate = { ...createUserDto, password: hashedPassword };

      await this.userRepository.create(userToCreate);
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        details: error.message,
      });
    }
  }
  // FIND ALL USERS
  async findAllUsers() {
    return await this.userRepository.findAll();
  }

  // FIND ALL STUDENTS
  async findStudents() {
    return await this.userRepository.findStudents();
  }
  // FIND USER BY ID
  async findUserById(id: string) {
    return await this.userRepository.findById(id);
  }

  // Update USER
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Check for existing user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User not found`,
      });
    }
    const updateUser = await this.userRepository.update(id, updateUserDto);
    if (updateUser) {
      return { statusCode: 200, message: 'update successfully' };
    }
  }

  // FILTER SCHOOLS TO APPLT BASED ON STUDENT BAC TYPE
  async findSchoolsByBacOption(bacOption: BacOption) {
    return await this.userRepository.filterByBacOption(bacOption);
  }

  // DELETE USER
  async deleteUser(id: string) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'this user does not exist',
      });
    }
    return await this.userRepository.delete(id);
  }

  async updateHashedRefreshToken(userId: string, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRT,
      },
    });
  }
}
