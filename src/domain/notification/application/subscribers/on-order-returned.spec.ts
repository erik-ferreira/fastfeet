import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification"

import { makeOrder } from "@/test/factories/make-order"

import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification-repository"

import { waitFor } from "@/test/utils/wait-for"

import { OnOrderReturned } from "./on-order-returned"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository

let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: any

describe("On Order Returned", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryNotificationRepository = new InMemoryNotificationRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    new OnOrderReturned(sendNotificationUseCase)
  })

  it("should send a notification when order is waiting", async () => {
    const order = makeOrder({ status: "WITHDRAWN" })

    order.returnOrder()

    await inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
