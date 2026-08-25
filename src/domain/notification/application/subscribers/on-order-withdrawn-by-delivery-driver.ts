import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"

import { OrderWithdrawnByDeliveryDriverEvent } from "@/domain/delivery-and-order/enterprise/events/order-withdrawn-by-delivery-driver-event"

import { SendNotificationUseCase } from "../use-cases/send-notification"

export class OnOrderWaitingForPickup implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOnOrderWaitingNotification.bind(this),
      OrderWithdrawnByDeliveryDriverEvent.name,
    )
  }

  private async sendOnOrderWaitingNotification({
    order,
  }: OrderWithdrawnByDeliveryDriverEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `O pedido "${order.title}" foi retirado pelo entregador`,
      content: `O entregador retirou seu pedido e ja está a caminho.`,
    })
  }
}
