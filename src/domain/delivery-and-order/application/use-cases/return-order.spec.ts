import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeOrder } from "@/test/factories/make-order"

import { ReturnOrderUseCase } from "./return-order"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ReturnOrderUseCase

describe("Return Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new ReturnOrderUseCase(inMemoryOrderRepository)
  })

  it("should be able to mark order as RETURNED", async () => {
    const order = makeOrder({ status: "WITHDRAWN" }, new UniqueEntityID("1"))
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderRepository.items).toEqual([
      expect.objectContaining({ status: "RETURNED" }),
    ])
  })

  it("should not be able to mark order as RETURNED with order not found", async () => {
    const result = await sut.execute({
      orderId: "id-non-exits",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to mark order as RETURNED if the order status is anything other than WITHDRAWN", async () => {
    const order = makeOrder(
      {
        status: "PENDING",
      },
      new UniqueEntityID("1"),
    )
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(NotAllowedError)
  })
})
