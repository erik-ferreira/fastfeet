import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"

import { OrderDeliveredToRecipientEvent } from "@/domain/delivery-and-order/enterprise/events/order-delivered-to-recipient-event"

import { SendNotificationUseCase } from "../use-cases/send-notification"

export class OnOrderDeliveredToRecipient implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOnOrderWaitingNotification.bind(this),
      OrderDeliveredToRecipientEvent.name,
    )
  }

  private async sendOnOrderWaitingNotification({
    order,
  }: OrderDeliveredToRecipientEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Seu pedido "${order.title}" foi entregue`,
      content: `Sua encomenda já foi entregue ao destinatário.`,
    })
  }
}
