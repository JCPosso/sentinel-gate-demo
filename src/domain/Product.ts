export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly stock: number,
  ) {
    if (stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }
  }

  get isAvailable(): boolean {
    return this.stock > 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      stock: this.stock,
    };
  }
}
