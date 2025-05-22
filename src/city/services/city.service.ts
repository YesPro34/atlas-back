import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';
import { CityRepository } from '../repositories/city.repository';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  async create(createCityDto: CreateCityDto) {
    return await this.cityRepository.create(createCityDto);
  }

  async findAll() {
    return await this.cityRepository.findAll();
  }

  async findOne(id: string) {
    const city = await this.cityRepository.findOne(id);
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    const city = await this.cityRepository.findOne(id);
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return await this.cityRepository.update(id, updateCityDto);
  }

  async remove(id: string) {
    const city = await this.cityRepository.findOne(id);
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    await this.cityRepository.remove(id);
  }
}
