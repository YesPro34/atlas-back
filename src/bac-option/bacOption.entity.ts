export class BacOptionEntity {
  name: string;

  constructor(partial: Partial<BacOptionEntity>) {
    Object.assign(this, partial);
  }
}
