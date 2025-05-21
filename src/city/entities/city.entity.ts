export class CityEntity {
  id: string;
  name: string;

  constructor(partial: Partial<CityEntity>) {
    Object.assign(this, partial);
  }
}
