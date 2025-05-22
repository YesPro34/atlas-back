import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFiliereDto } from '../dto/create-filiere.dto';
import { UpdateFiliereDto } from '../dto/update-filiere.dto';
import { FiliereRepository } from '../repositories/filiere.repository';

@Injectable()
export class FiliereService {
  constructor(private readonly filiereRepository: FiliereRepository) {}

  async create(createFiliereDto: CreateFiliereDto) {
    return await this.filiereRepository.create(createFiliereDto);
  }

  async findAll() {
    return await this.filiereRepository.findAll();
  }

  async findOne(id: string) {
    const filiere = await this.filiereRepository.findOne(id);
    if (!filiere) {
      throw new NotFoundException(`Filiere with ID ${id} not found`);
    }
    return filiere;
  }

  async update(id: string, updateFiliereDto: UpdateFiliereDto) {
    const filiere = await this.filiereRepository.findOne(id);
    if (!filiere) {
      throw new NotFoundException(`Filiere with ID ${id} not found`);
    }
    return await this.filiereRepository.update(id, updateFiliereDto);
  }

  async remove(id: string) {
    const filiere = await this.filiereRepository.findOne(id);
    if (!filiere) {
      throw new NotFoundException(`Filiere with ID ${id} not found`);
    }
    await this.filiereRepository.remove(id);
  }
}
