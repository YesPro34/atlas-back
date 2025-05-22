import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBacOptionDto } from '../dto/create-bac-option.dto';
import { UpdateBacOptionDto } from '../dto/update-bac-option.dto';
import { BacOptionRepository } from '../repositories/bac-option.repository';

@Injectable()
export class BacOptionService {
  constructor(private readonly bacOptionRepository: BacOptionRepository) {}

  async create(createBacOptionDto: CreateBacOptionDto) {
    return await this.bacOptionRepository.create(createBacOptionDto);
  }

  async findAll() {
    return await this.bacOptionRepository.findAll();
  }

  async findOne(id: string) {
    const bacOption = await this.bacOptionRepository.findOne(id);
    if (!bacOption) {
      throw new NotFoundException(`BacOption with ID ${id} not found`);
    }
    return bacOption;
  }

  async update(id: string, updateBacOptionDto: UpdateBacOptionDto) {
    const bacOption = await this.bacOptionRepository.findOne(id);
    if (!bacOption) {
      throw new NotFoundException(`BacOption with ID ${id} not found`);
    }
    return await this.bacOptionRepository.update(id, updateBacOptionDto);
  }

  async remove(id: string) {
    const bacOption = await this.bacOptionRepository.findOne(id);
    if (!bacOption) {
      throw new NotFoundException(`BacOption with ID ${id} not found`);
    }
    await this.bacOptionRepository.remove(id);
  }
}
