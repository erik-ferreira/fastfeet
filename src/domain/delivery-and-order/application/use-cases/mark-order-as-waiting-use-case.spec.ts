import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeOrder } from "@/test/factories/make-order"
import { makeRecipient } from "@/test/factories/make-recipient"

import { MarkOrderAsWaitingUseCase } from "./mark-order-as-waiting-use-case"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: MarkOrderAsWaitingUseCase

describe("Mark Order as Waiting", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new MarkOrderAsWaitingUseCase(inMemoryOrderRepository)
  })

  it("should be able to mark order as waiting", async () => {
    const order = makeOrder({}, new UniqueEntityID("1"))

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderRepository.items).toEqual([
      expect.objectContaining({ status: "WAITING" }),
    ])
  })

  it("should not be able to mark order as waiting not found", async () => {
    const result = await sut.execute({
      orderId: "id-non-existing",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
