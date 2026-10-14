export type OrderStatus = "pending" | "shipped" | "delivered";

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
};

export class Order {
  private _status: OrderStatus = "pending";
  private _discountPercentage = 0;
  private _paymentTransactionId: string | null = null;

  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly createdAt: Date = new Date(),
  ) {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a cero");
    }
  }

  get status(): OrderStatus {
    return this._status;
  }

  get discountPercentage(): number {
    return this._discountPercentage;
  }

  get paymentTransactionId(): string | null {
    return this._paymentTransactionId;
  }

  confirmPayment(transactionId: string): void {
    this._paymentTransactionId = transactionId;
  }

  applyDiscount(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error("El descuento debe estar entre 0 y 100");
    }
    this._discountPercentage = percentage;
  }

  changeStatus(newStatus: OrderStatus): void {
    if (!ALLOWED_TRANSITIONS[this._status].includes(newStatus)) {
      throw new Error(`Transición de estado inválida: ${this._status} → ${newStatus}`);
    }
    this._status = newStatus;
  }

  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      productId: this.productId,
      quantity: this.quantity,
      status: this._status,
      discountPercentage: this._discountPercentage,
      paymentTransactionId: this._paymentTransactionId,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
