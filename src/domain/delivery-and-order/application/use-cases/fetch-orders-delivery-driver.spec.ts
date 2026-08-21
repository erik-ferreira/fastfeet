import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { makeOrder } from "@/test/factories/make-order"
import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { FetchOrdersDeliveryDriverUseCase } from "./fetch-orders-delivery-driver"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: FetchOrdersDeliveryDriverUseCase

describe("Fetch Orders Delivery Driver", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new FetchOrdersDeliveryDriverUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryDriverRepository,
    )
  })

  it("should be able to fetch orders delivery driver", async () => {
    const deliveryDriver = makeDeliveryDriver({})
    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    for (let i = 1; i <= 4; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({
          title: `Order ${i}`,
          deliveryDriverId: deliveryDriver.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 1,
      deliveryDriverId: deliveryDriver.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(4)
    }
  })

  it("should not be able to fetch orders delivery driver not found", async () => {
    const result = await sut.execute({
      page: 1,
      deliveryDriverId: "id-non-existing",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should be able to fetch orders delivery driver and list is empty", async () => {
    const deliveryDriver = makeDeliveryDriver({})
    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      page: 1,
      deliveryDriverId: deliveryDriver.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(0)
    }
  })
})
