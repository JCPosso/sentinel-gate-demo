import { Order } from "../../domain/Order";

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  countCompletedByCustomer(customerId: string): Promise<number>;
  findCreatedSince(since: Date): Promise<Order[]>;
  /**
   * Token que cambia cada vez que se modifica el repositorio.
   * Permite a las lecturas cacheadas saber si deben recalcularse.
   */
  changeToken(): number;
}
