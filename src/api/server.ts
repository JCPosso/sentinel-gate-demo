import express from "express";
import { CreateOrder } from "../application/commands/CreateOrder";
import { UpdateOrderStatus } from "../application/commands/UpdateOrderStatus";
import { GetOrderById } from "../application/queries/GetOrderById";
import { GetSalesReportByProduct } from "../application/queries/GetSalesReportByProduct";
import { GetAvailableProducts } from "../application/queries/GetAvailableProducts";
import { OrderStatus } from "../domain/Order";
import { InMemoryOrderRepository } from "../infrastructure/InMemoryOrderRepository";
import { InMemoryProductRepository } from "../infrastructure/InMemoryProductRepository";
import { InMemoryEventPublisher } from "../infrastructure/InMemoryEventPublisher";
import { ConsoleCustomerNotifier } from "../infrastructure/ConsoleCustomerNotifier";
import { SimulatedPaymentGateway } from "../infrastructure/SimulatedPaymentGateway";
import { RetryingPaymentGateway } from "../infrastructure/RetryingPaymentGateway";
import { PaymentDeclinedError } from "../application/ports/PaymentGatewayPort";

const app = express();
app.use(express.json());

const repository = new InMemoryOrderRepository();
const productRepository = new InMemoryProductRepository();
const eventPublisher = new InMemoryEventPublisher();
const customerNotifier = new ConsoleCustomerNotifier();
// Gateway de pago simulado envuelto en un decorador con reintentos.
const paymentGateway = new RetryingPaymentGateway(new SimulatedPaymentGateway());
const createOrder = new CreateOrder(repository, eventPublisher, paymentGateway);
const updateOrderStatus = new UpdateOrderStatus(repository, eventPublisher, customerNotifier);
const getOrderById = new GetOrderById(repository);
const getSalesReportByProduct = new GetSalesReportByProduct(repository);
const getAvailableProducts = new GetAvailableProducts(productRepository);

const VALID_STATUSES: OrderStatus[] = ["pending", "shipped", "delivered"];

app.post("/orders", async (req, res) => {
  try {
    const { id, customerId, productId, quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      res.status(400).json({ error: "La cantidad debe ser un entero positivo" });
      return;
    }
    const order = await createOrder.execute(id, customerId, productId, quantity);
    res.status(201).json(order);
  } catch (err) {
    if (err instanceof PaymentDeclinedError) {
      res.status(402).json({ error: `El pago no pudo procesarse: ${err.message}` });
      return;
    }
    res.status(400).json({ error: (err as Error).message });
  }
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}` });
      return;
    }
    const order = await updateOrderStatus.execute(req.params.id, status);
    res.json(order);
  } catch (err) {
    const message = (err as Error).message;
    const notFound = message === "Orden no encontrada";
    res.status(notFound ? 404 : 400).json({ error: message });
  }
});

app.get("/products", async (_req, res) => {
  const products = await getAvailableProducts.execute();
  res.json(products);
});

app.get("/reports/sales-by-product", async (_req, res) => {
  const report = await getSalesReportByProduct.execute();
  res.json(report);
});

app.get("/orders/:id", async (req, res) => {
  const order = await getOrderById.execute(req.params.id);
  if (!order) { res.status(404).json({ error: "Orden no encontrada" }); return; }
  res.json(order);
});

const PORT = 3002;
app.listen(PORT, () => console.log(`inventario-base-ref escuchando en puerto ${PORT}`));
