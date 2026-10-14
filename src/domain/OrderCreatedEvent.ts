export class OrderCreatedEvent {
  public readonly type = "OrderCreated" as const;
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
