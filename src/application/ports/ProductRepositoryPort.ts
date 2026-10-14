import { Product } from "../../domain/Product";

export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findAvailable(): Promise<Product[]>;
}
