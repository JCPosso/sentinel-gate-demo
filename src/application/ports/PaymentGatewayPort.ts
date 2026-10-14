import { Order } from "../../domain/Order";

export interface PaymentResult {
  transactionId: string;
  amount: number;
}

/**
 * Error de pago. `retryable` indica si el fallo es transitorio (p. ej. el
 * servicio no respondió) y por tanto tiene sentido reintentar el cobro.
 */
export class PaymentDeclinedError extends Error {
  constructor(message: string, public readonly retryable: boolean = true) {
    super(message);
    this.name = "PaymentDeclinedError";
  }
}

export interface PaymentGatewayPort {
  charge(order: Order): Promise<PaymentResult>;
}
