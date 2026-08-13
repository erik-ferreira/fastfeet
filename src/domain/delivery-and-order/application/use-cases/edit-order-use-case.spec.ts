import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeOrder } from "@/test/factories/make-order"

import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { EditOrderUseCase } from "./edit-order-use-case"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: EditOrderUseCase

describe("Edit Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new EditOrderUseCase(inMemoryOrderRepository)
  })

  it("should be able to edit a order", async () => {
    const order = makeOrder(
      {
        title: "Pedido 1",
        latitude: -3.7997858019618707,
        longitude: -38.5113046020789,
      },
      new UniqueEntityID("1"),
    )

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      latitude: -3.7992714964880694,
      longitude: -38.50961383615802,
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        latitude: -3.7992714964880694,
        longitude: -38.50961383615802,
      }),
    })
  })

  it("should not be able to edit a non-existing order", async () => {
    const result = await sut.execute({
      orderId: "non-existing-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to edit a order with status DELIVERED", async () => {
    const order = makeOrder({ status: "DELIVERED" }, new UniqueEntityID("1"))

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
