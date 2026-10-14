import { Order } from "../domain/Order";
import { OrderRepositoryPort } from "../application/ports/OrderRepositoryPort";

export class InMemoryOrderRepository implements OrderRepositoryPort {
  private orders: Order[] = [];
  private version = 0;

  async save(order: Order): Promise<void> {
    const index = this.orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      this.orders[index] = order;
    } else {
      this.orders.push(order);
    }
    this.version++;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async countCompletedByCustomer(customerId: string): Promise<number> {
    return this.orders.filter(
      (o) => o.customerId === customerId && o.status === "delivered",
    ).length;
  }

  async findCreatedSince(since: Date): Promise<Order[]> {
    return this.orders.filter((o) => o.createdAt >= since);
  }

  changeToken(): number {
    return this.version;
  }
}
