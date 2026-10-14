import { Order } from "../domain/Order";
import {
  PaymentGatewayPort,
  PaymentResult,
  PaymentDeclinedError,
} from "../application/ports/PaymentGatewayPort";

const SIMULATED_UNIT_PRICE = 100;

export class SimulatedPaymentGateway implements PaymentGatewayPort {
  private sequence = 0;

  // failureRate: probabilidad (0..1) de un fallo transitorio, para simular
  // un servicio de pago externo inestable.
  constructor(private readonly failureRate: number = 0.5) {}

  async charge(order: Order): Promise<PaymentResult> {
    // Adaptador de simulación: en un sistema real esto llamaría a un servicio
    // de pago externo (Stripe, PayPal, PSE, etc.).
    if (Math.random() < this.failureRate) {
      throw new PaymentDeclinedError(
        `El servicio de pago no respondió para la orden ${order.id}`,
      );
    }

    const gross = SIMULATED_UNIT_PRICE * order.quantity;
    const amount = gross * (1 - order.discountPercentage / 100);
    this.sequence++;
    return { transactionId: `sim_${order.id}_${this.sequence}`, amount };
  }
}
