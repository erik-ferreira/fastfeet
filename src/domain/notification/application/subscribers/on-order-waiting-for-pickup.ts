import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"

import { SendNotificationUseCase } from "../use-cases/send-notification"
import { OrderWaitingForPickupEvent } from "@/domain/delivery-and-order/enterprise/events/order-waiting-for-pickup-event"

export class OnOrderWaitingForPickup implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOnOrderWaitingNotification.bind(this),
      OrderWaitingForPickupEvent.name,
    )
  }

  private async sendOnOrderWaitingNotification({
    order,
  }: OrderWaitingForPickupEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Seu pedido "${order.title}" está aguardando retirada`,
      content: `Sua encomenda já está pronta para ser retirada pelo entregador.`,
    })
  }
}
