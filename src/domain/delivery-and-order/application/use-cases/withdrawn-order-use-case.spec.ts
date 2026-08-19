import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeOrder } from "@/test/factories/make-order"
import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { WithdrawnOrderUseCase } from "./withdrawn-order-use-case"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: WithdrawnOrderUseCase

describe("Withdrawn Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new WithdrawnOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryDriverRepository,
    )
  })

  it("should be able to mark order as WITHDRAWN and assign it to a delivery driver", async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityID("driver-1"),
    )
    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const order = makeOrder(
      {
        deliveryDriverId: deliveryDriver.id,
      },
      new UniqueEntityID("1"),
    )
    await inMemoryOrderRepository.create(order)

    expect(order).toEqual(
      expect.objectContaining({
        deliveryDriverId: order.deliveryDriverId,
      }),
    )

    if (order.deliveryDriverId) {
      const result = await sut.execute({
        orderId: order.id.toString(),
        deliveryDriverId: order.deliveryDriverId.toString(),
      })

      expect(result.isRight()).toBe(true)
      expect(inMemoryOrderRepository.items).toHaveLength(1)
      expect(inMemoryOrderRepository.items).toEqual([
        expect.objectContaining({ status: "WITHDRAWN" }),
      ])
    }
  })

  it("should not be able to mark order as WITHDRAWN with delivery driver not found", async () => {
    const order = makeOrder({}, new UniqueEntityID("1"))

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryDriverId: "id-non-existing",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to mark order as WITHDRAWN with order not found", async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityID("driver-1"),
    )
    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const order = makeOrder(
      {
        deliveryDriverId: deliveryDriver.id,
      },
      new UniqueEntityID("1"),
    )

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryDriverId: deliveryDriver.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
