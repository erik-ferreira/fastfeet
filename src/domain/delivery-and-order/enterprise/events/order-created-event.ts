import { DomainEvent } from "@/core/events/domain-event"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Order } from "../entities/order"

export class OrderCreatedEvent implements DomainEvent {
  public occurredAt: Date

  private _order: Order

  constructor(order: Order) {
    this._order = order
    this.occurredAt = new Date()
  }

  get order(): Order {
    return this._order
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}
