import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { makeRecipient } from "@/test/factories/make-recipient"

import { CreateOrderUseCase } from "./create-order"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe("Create Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(inMemoryOrderRepository)
  })

  it("should be able to create a order", async () => {
    const recipient = makeRecipient()

    const result = await sut.execute({
      title: "Pedido 1",
      status: "PENDING",
      latitude: -3.799720466823705,
      longitude: -38.51131351886598,
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderRepository.items).toEqual([
      expect.objectContaining({ title: "Pedido 1" }),
    ])
  })
})
