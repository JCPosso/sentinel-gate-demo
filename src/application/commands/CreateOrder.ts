import { Order } from "../../domain/Order";
import { OrderCreatedEvent } from "../../domain/OrderCreatedEvent";
import { OrderRepositoryPort } from "../ports/OrderRepositoryPort";
import { EventPublisherPort } from "../ports/EventPublisherPort";
import { PaymentGatewayPort } from "../ports/PaymentGatewayPort";

const LOYALTY_COMPLETED_ORDERS_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENTAGE = 10;

export class CreateOrder {
  constructor(
    private readonly repository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(id: string, customerId: string, productId: string, quantity: number): Promise<Order> {
    const order = new Order(id, customerId, productId, quantity);

    const completedOrders = await this.repository.countCompletedByCustomer(customerId);
    if (completedOrders > LOYALTY_COMPLETED_ORDERS_THRESHOLD) {
      order.applyDiscount(LOYALTY_DISCOUNT_PERCENTAGE);
    }

    // Se cobra el pago con el servicio externo ANTES de confirmar la orden.
    // El gateway inyectado incluye reintentos ante fallos transitorios; si el
    // pago termina fallando, se propaga el error y la orden no se persiste
    // ni se publica el evento de creación.
    const payment = await this.paymentGateway.charge(order);
    order.confirmPayment(payment.transactionId);

    await this.repository.save(order);
    await this.eventPublisher.publish(new OrderCreatedEvent(order.id, order.customerId));
    return order;
  }
}
