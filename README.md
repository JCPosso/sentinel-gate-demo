# inventario-base-ref

> Repo de demo para el gate de arquitectura de [Sentinel Architect](https://github.com/JCPosso/sentinel-architect).
> Cada push corre `.github/workflows/sentinel-gate.yml`: clona Sentinel, analiza
> este código y deja el dashboard (`dashboard.html`) descargable como artifact
> del run en la pestaña Actions. Este código tiene violaciones reales y
> conocidas (R4, R5) usadas también en la tesis — no se modificó para la demo.

Servicio de órdenes con separación de comandos y consultas.

## Instalación

npm install
npm run dev

## Endpoints

- POST /orders — crea una orden (id, customerId, productId, quantity)
- GET /orders/:id — consulta una orden
# demo miércoles, 21 de octubre de 2026, 22:13:22 -05
