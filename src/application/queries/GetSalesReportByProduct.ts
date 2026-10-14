import { OrderRepositoryPort } from "../ports/OrderRepositoryPort";

export interface ProductSales {
  productId: string;
  totalQuantity: number;
  orderCount: number;
}

export interface SalesReport {
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  products: ProductSales[];
}

interface CachedReport {
  token: number;
  dayKey: string;
  report: SalesReport;
}

/**
 * Reporte de ventas totales por producto en el último mes.
 *
 * Optimización: el reporte es un cálculo agregado costoso, por lo que se
 * memoiza en lugar de recalcularse en cada consulta. El resultado cacheado
 * se reutiliza mientras se cumplan dos condiciones:
 *   1. El repositorio no ha cambiado (mismo `changeToken`).
 *   2. Seguimos en el mismo día (para que la ventana "último mes" no se quede
 *      obsoleta con el paso del tiempo).
 * Solo cuando alguna cambia se vuelve a agregar.
 */
export class GetSalesReportByProduct {
  private cache: CachedReport | null = null;

  constructor(private readonly repository: OrderRepositoryPort) {}

  async execute(now: Date = new Date()): Promise<SalesReport> {
    const token = this.repository.changeToken();
    const dayKey = now.toISOString().slice(0, 10);

    if (this.cache && this.cache.token === token && this.cache.dayKey === dayKey) {
      return this.cache.report;
    }

    const report = await this.buildReport(now);
    this.cache = { token, dayKey, report };
    return report;
  }

  private async buildReport(now: Date): Promise<SalesReport> {
    const since = new Date(now);
    since.setMonth(since.getMonth() - 1);

    const orders = await this.repository.findCreatedSince(since);

    const byProduct = new Map<string, ProductSales>();
    for (const order of orders) {
      const entry = byProduct.get(order.productId) ?? {
        productId: order.productId,
        totalQuantity: 0,
        orderCount: 0,
      };
      entry.totalQuantity += order.quantity;
      entry.orderCount += 1;
      byProduct.set(order.productId, entry);
    }

    const products = [...byProduct.values()].sort(
      (a, b) => b.totalQuantity - a.totalQuantity,
    );

    return {
      periodStart: since.toISOString(),
      periodEnd: now.toISOString(),
      generatedAt: now.toISOString(),
      products,
    };
  }
}
