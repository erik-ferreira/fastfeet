import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { FetchDeliveryDriversUseCase } from "./fetch-delivery-drivers"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: FetchDeliveryDriversUseCase

describe("Fetch Delivery Drivers", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new FetchDeliveryDriversUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to fetch delivery drivers", async () => {
    await inMemoryDeliveryDriverRepository.create(
      makeDeliveryDriver({
        createdAt: new Date(2026, 7, 28),
      }),
    )
    await inMemoryDeliveryDriverRepository.create(
      makeDeliveryDriver({
        createdAt: new Date(2026, 7, 31),
      }),
    )
    await inMemoryDeliveryDriverRepository.create(
      makeDeliveryDriver({
        createdAt: new Date(2026, 7, 10),
      }),
    )
    await inMemoryDeliveryDriverRepository.create(
      makeDeliveryDriver({
        createdAt: new Date(2026, 7, 25),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.deliveryDrivers).toEqual([
        expect.objectContaining({ createdAt: new Date(2026, 7, 31) }),
        expect.objectContaining({ createdAt: new Date(2026, 7, 28) }),
        expect.objectContaining({ createdAt: new Date(2026, 7, 25) }),
        expect.objectContaining({ createdAt: new Date(2026, 7, 10) }),
      ])
    }
  })

  it("should be able to fetch paginated delivery drivers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryDriverRepository.create(
        makeDeliveryDriver({
          cpf: Cpf.create(i <= 9 ? `0${i}000000000` : `${i}000000000`),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.deliveryDrivers).toHaveLength(2)
    }
  })
})
