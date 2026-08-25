import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"

import { OrderReturnedEvent } from "@/domain/delivery-and-order/enterprise/events/order-returned-event"

import { SendNotificationUseCase } from "../use-cases/send-notification"

export class OnOrderReturned implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOnOrderWaitingNotification.bind(this),
      OrderReturnedEvent.name,
    )
  }

  private async sendOnOrderWaitingNotification({ order }: OrderReturnedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `O pedido "${order.title}" foi devolvido`,
      content: `O pedido foi devolvido pelo destinatário.`,
    })
  }
}
