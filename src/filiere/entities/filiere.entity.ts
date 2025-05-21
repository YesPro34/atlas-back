export class FiliereEntity {
  id: string;
  name: string;

  constructor(partial: Partial<FiliereEntity>) {
    Object.assign(this, partial);
  }
}
