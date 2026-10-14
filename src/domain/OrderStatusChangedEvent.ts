import { OrderStatus } from "./Order";

export class OrderStatusChangedEvent {
  public readonly type = "OrderStatusChanged" as const;
  constructor(
    public readonly orderId: string,
    public readonly previousStatus: OrderStatus,
    public readonly newStatus: OrderStatus,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
