import { Injectable, NotFoundException } from '@nestjs/common';
import { CityRepository } from '../repositories/city.repository';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update.city.dto';

@Injectable()
export class CityService {
  constructor(private readonly cityRepo: CityRepository) {}

  async create(createCityDto: CreateCityDto) {
    return await this.cityRepo.create(createCityDto);
  }

  async findAll() {
    return await this.cityRepo.findAll();
  }

  async findOne(id: string) {
    const city = await this.cityRepo.findOne(id);
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    await this.findOne(id); // Ensure city exists
    return this.cityRepo.update(id, updateCityDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure city exists
    return this.cityRepo.delete(id);
  }
}
