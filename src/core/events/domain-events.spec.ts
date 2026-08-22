import { vi } from "vitest"

import { DomainEvent } from "./domain-event"
import { DomainEvents } from "./domain-events"
import { AggregateRoot } from "../entities/aggregate-root"

class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.occurredAt = new Date()
  }

  public getAggregateId() {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe("Domain Events", () => {
  it("should be able to dispatch and listen to events", () => {
    const callbackSpy = vi.fn()

    // Registered subscriber (listening to the response created event)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Creating a response but WITHOUT saving in to the database
    const aggregate = CustomAggregate.create()

    // Assuring that the event was created but NOT dispatched yet
    expect(aggregate.domainEvents).toHaveLength(1)

    // Saving the response in to the database, and dispatching the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The subscriber listens to the event and does what needs to be done with the data
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
