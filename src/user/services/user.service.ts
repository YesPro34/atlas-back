import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByMassarCode(massarCode: string) {
    return await this.userRepository.findByCodeMassar(massarCode);
  }

  // set all crud function for the user with role students
  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }
  async findAllUsers() {
    return await this.userRepository.findAll();
  }
  async findUserById(id: string) {
    return await this.userRepository.findById(id);
  }
  async updateUser(id: string, user: any) {
    return await this.userRepository.update(id, user);
  }
  async deleteUser(id: string) {
    return await this.userRepository.delete(id);
  }
}
