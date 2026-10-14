import { Order } from "../../domain/Order";
import { OrderRepositoryPort } from "../ports/OrderRepositoryPort";

export class GetOrderById {
  constructor(private readonly repository: OrderRepositoryPort) {}

  async execute(id: string): Promise<Order | null> {
    return this.repository.findById(id);
  }
}
