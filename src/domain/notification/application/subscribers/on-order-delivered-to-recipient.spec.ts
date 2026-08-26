import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification"

import { makeOrder } from "@/test/factories/make-order"
import { makeAttachment } from "@/test/factories/make-attachment"
import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification-repository"

import { waitFor } from "@/test/utils/wait-for"

import { OnOrderDeliveredToRecipient } from "./on-order-delivered-to-recipient"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository

let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: any

describe("On Order Delivered to recipient", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryNotificationRepository = new InMemoryNotificationRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    new OnOrderDeliveredToRecipient(sendNotificationUseCase)
  })

  it("should send a notification when order is delivered to recipient", async () => {
    const attachment = makeAttachment()
    const deliveryDriver = makeDeliveryDriver()
    const order = makeOrder({
      status: "WITHDRAWN",
      deliveryDriverId: deliveryDriver.id,
    })

    order.deliver(attachment.id)

    await inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
