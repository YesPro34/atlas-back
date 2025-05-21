export class BacOptionEntity {
  id: string;
  name: string;

  constructor(partial: Partial<BacOptionEntity>) {
    Object.assign(this, partial);
  }
}
