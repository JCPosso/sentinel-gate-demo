import { Order, OrderStatus } from "../../domain/Order";
import { OrderStatusChangedEvent } from "../../domain/OrderStatusChangedEvent";
import { OrderRepositoryPort } from "../ports/OrderRepositoryPort";
import { EventPublisherPort } from "../ports/EventPublisherPort";
import { CustomerNotifierPort } from "../ports/CustomerNotifierPort";

export class UpdateOrderStatus {
  constructor(
    private readonly repository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly customerNotifier: CustomerNotifierPort,
  ) {}

  async execute(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new Error("Orden no encontrada");
    }

    const previousStatus = order.status;
    order.changeStatus(newStatus);
    await this.repository.save(order);
    await this.eventPublisher.publish(
      new OrderStatusChangedEvent(order.id, previousStatus, order.status),
    );

    if (order.status === "shipped") {
      await this.customerNotifier.notifyOrderShipped(order);
    }

    return order;
  }
}
