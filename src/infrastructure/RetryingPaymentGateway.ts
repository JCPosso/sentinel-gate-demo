import { Order } from "../domain/Order";
import {
  PaymentGatewayPort,
  PaymentResult,
  PaymentDeclinedError,
} from "../application/ports/PaymentGatewayPort";

/**
 * Decorador que añade reintentos a cualquier PaymentGatewayPort. Reintenta
 * únicamente los fallos marcados como recuperables, con una pequeña espera
 * entre intentos. Si se agotan los intentos, propaga el último error.
 */
export class RetryingPaymentGateway implements PaymentGatewayPort {
  constructor(
    private readonly inner: PaymentGatewayPort,
    private readonly maxAttempts: number = 3,
    private readonly delayMs: number = 100,
  ) {
    if (maxAttempts < 1) {
      throw new Error("maxAttempts debe ser al menos 1");
    }
  }

  async charge(order: Order): Promise<PaymentResult> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        return await this.inner.charge(order);
      } catch (err) {
        lastError = err;
        const retryable =
          err instanceof PaymentDeclinedError ? err.retryable : false;

        if (!retryable || attempt === this.maxAttempts) {
          break;
        }

        console.log(
          `[Pago] Intento ${attempt}/${this.maxAttempts} falló para la orden ${order.id}: ` +
            `${(err as Error).message}. Reintentando...`,
        );
        await this.delay(this.delayMs);
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
