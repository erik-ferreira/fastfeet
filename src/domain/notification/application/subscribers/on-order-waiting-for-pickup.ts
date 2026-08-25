import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"

import { OrderWaitingForPickupEvent } from "@/domain/delivery-and-order/enterprise/events/order-waiting-for-pickup-event"

import { SendNotificationUseCase } from "../use-cases/send-notification"

export class OnOrderWaitingForPickup implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOnOrderWaitingForPickupNotification.bind(this),
      OrderWaitingForPickupEvent.name,
    )
  }

  private async sendOnOrderWaitingForPickupNotification({
    order,
  }: OrderWaitingForPickupEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Seu pedido "${order.title}" está aguardando retirada`,
      content: `Sua encomenda já está pronta para ser retirada pelo entregador.`,
    })
  }
}
