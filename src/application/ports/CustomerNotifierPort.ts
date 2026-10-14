import { Order } from "../../domain/Order";

export interface CustomerNotifierPort {
  notifyOrderShipped(order: Order): Promise<void>;
}
