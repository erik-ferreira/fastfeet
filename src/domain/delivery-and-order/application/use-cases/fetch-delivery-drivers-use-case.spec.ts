import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { FetchDeliveryDriversUseCase } from "./fetch-delivery-drivers-use-case"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: FetchDeliveryDriversUseCase

describe("Fetch Delivery Drivers", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()

    sut = new FetchDeliveryDriversUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to fetch delivery drivers", async () => {
    const deliveryDriver1 = makeDeliveryDriver(
      {},
      new UniqueEntityID("delivery-driver-1"),
    )
    const deliveryDriver2 = makeDeliveryDriver(
      {},
      new UniqueEntityID("delivery-driver-2"),
    )
    const deliveryDriver3 = makeDeliveryDriver(
      {},
      new UniqueEntityID("delivery-driver-3"),
    )
    const deliveryDriver4 = makeDeliveryDriver(
      {},
      new UniqueEntityID("delivery-driver-4"),
    )

    await inMemoryDeliveryDriverRepository.create(deliveryDriver1)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver2)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver3)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver4)

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.deliveryDrivers).toEqual([
      expect.objectContaining({ id: "delivery-driver-1" }),
      expect.objectContaining({ id: "delivery-driver-2" }),
      expect.objectContaining({ id: "delivery-driver-3" }),
      expect.objectContaining({ id: "delivery-driver-4" }),
    ])
  })

  // it("should hash student password upon registration", async () => {})
})
