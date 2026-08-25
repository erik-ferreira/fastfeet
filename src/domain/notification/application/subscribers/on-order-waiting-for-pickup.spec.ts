import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification"

import { makeOrder } from "@/test/factories/make-order"
import { makeRecipient } from "@/test/factories/make-recipient"
import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { waitFor } from "@/test/utils/wait-for"

import { OnOrderWithdrawnByDeliveryDriver } from "./on-order-withdrawn-by-delivery-driver"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository

let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: any

describe("On Order Waiting for Pickup", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryNotificationRepository = new InMemoryNotificationRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    new OnOrderWithdrawnByDeliveryDriver(sendNotificationUseCase)
  })

  it("should send a notification when order is waiting", async () => {
    const order = makeOrder()
    await inMemoryOrderRepository.create(order)

    order.markAsWaiting()
    await inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
