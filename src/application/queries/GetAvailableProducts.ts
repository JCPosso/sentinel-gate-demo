import { Product } from "../../domain/Product";
import { ProductRepositoryPort } from "../ports/ProductRepositoryPort";

/**
 * Lista los productos disponibles (con stock > 0) junto con su cantidad
 * en inventario.
 */
export class GetAvailableProducts {
  constructor(private readonly repository: ProductRepositoryPort) {}

  async execute(): Promise<Product[]> {
    return this.repository.findAvailable();
  }
}
