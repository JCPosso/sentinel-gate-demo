import { DomainEvent, EventPublisherPort } from "../application/ports/EventPublisherPort";

export class InMemoryEventPublisher implements EventPublisherPort {
  async publish(event: DomainEvent): Promise<void> {
    // Adaptador de simulación: en un sistema real esto publicaría a un bus de eventos.
  }
}
