export interface DomainEvent {
  readonly type: string;
}

export interface EventPublisherPort {
  publish(event: DomainEvent): Promise<void>;
}
