import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeOrder } from "@/test/factories/make-order"

import { GetOrderDetailsUseCase } from "./get-order-details"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: GetOrderDetailsUseCase

describe("Get Order Details", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new GetOrderDetailsUseCase(inMemoryOrderRepository)
  })

  it("should be able to order details", async () => {
    const order = makeOrder({}, new UniqueEntityID("1"))
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderRepository.items).toEqual([
      expect.objectContaining({ id: order.id }),
    ])
  })

  it("should not be able to get order details not found", async () => {
    const order = makeOrder({}, new UniqueEntityID("1"))

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ResourceNotFoundError)
  })
})
