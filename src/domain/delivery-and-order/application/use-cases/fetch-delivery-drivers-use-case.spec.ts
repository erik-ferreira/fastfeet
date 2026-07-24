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
    const deliveryDriver1 = makeDeliveryDriver({
      cpf: "10000000000",
    })
    const deliveryDriver2 = makeDeliveryDriver({
      cpf: "20000000000",
    })
    const deliveryDriver3 = makeDeliveryDriver({
      cpf: "30000000000",
    })
    const deliveryDriver4 = makeDeliveryDriver({
      cpf: "40000000000",
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver1)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver2)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver3)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver4)

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.deliveryDrivers).toEqual([
      expect.objectContaining({ cpf: "10000000000" }),
      expect.objectContaining({ cpf: "20000000000" }),
      expect.objectContaining({ cpf: "30000000000" }),
      expect.objectContaining({ cpf: "40000000000" }),
    ])
  })

  it("should be able to fetch paginated delivery drivers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryDriverRepository.create(
        makeDeliveryDriver({
          cpf: `${i}0000000000`,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.deliveryDrivers).toHaveLength(2)
  })
})
