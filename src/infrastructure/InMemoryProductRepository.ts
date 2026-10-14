import { Product } from "../domain/Product";
import { ProductRepositoryPort } from "../application/ports/ProductRepositoryPort";

export class InMemoryProductRepository implements ProductRepositoryPort {
  private products: Product[] = [
    new Product("prod-1", "Teclado mecánico", 12),
    new Product("prod-2", "Mouse inalámbrico", 5),
    new Product("prod-3", "Monitor 27\"", 0),
    new Product("prod-4", "Audífonos", 8),
  ];

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findAvailable(): Promise<Product[]> {
    return this.products.filter((p) => p.isAvailable);
  }
}
