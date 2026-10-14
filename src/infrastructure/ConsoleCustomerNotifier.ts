import { Order } from "../domain/Order";
import { CustomerNotifierPort } from "../application/ports/CustomerNotifierPort";

export class ConsoleCustomerNotifier implements CustomerNotifierPort {
  async notifyOrderShipped(order: Order): Promise<void> {
    // Adaptador de simulación: en un sistema real esto enviaría un email/SMS/push.
    console.log(
      `[Notificación] Cliente ${order.customerId}: tu orden ${order.id} ha sido enviada.`,
    );
  }
}
