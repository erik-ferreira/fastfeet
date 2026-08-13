import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeOrder } from "@/test/factories/make-order"

import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { DeleteOrderUseCase } from "./delete-order-use-case"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: DeleteOrderUseCase

describe("Delete Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new DeleteOrderUseCase(inMemoryOrderRepository)
  })

  it("should be able to delete a order", async () => {
    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    await sut.execute({
      id: order.id.toString(),
    })

    expect(inMemoryOrderRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a order not found", async () => {
    const result = await sut.execute({
      id: "test",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
