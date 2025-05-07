import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFiliereDto } from '../dto/create-filiere.dto';
import { UpdateFiliereDto } from '../dto/update-filiere.dto';
import { FiliereRepository } from '../repositories/filiere.repository';

@Injectable()
export class FiliereService {
  constructor(private readonly filiereRepository: FiliereRepository) {}

  async create(data: CreateFiliereDto) {
    return await this.filiereRepository.create(data);
  }

  async findAll() {
    return await this.filiereRepository.findAll();
  }

  async findOne(id: string) {
    const filiere = await this.filiereRepository.findOne(id);
    if (!filiere) throw new NotFoundException('Filière not found');
    return filiere;
  }

  async update(id: string, data: UpdateFiliereDto) {
    const exists = await this.filiereRepository.findOne(id);
    if (!exists) throw new NotFoundException('Filière not found');

    return this.filiereRepository.update(id, data);
  }

  async remove(id: string) {
    const exists = await this.filiereRepository.findOne(id);
    if (!exists) throw new NotFoundException('Filière not found');

    return this.filiereRepository.remove(id);
  }
}
