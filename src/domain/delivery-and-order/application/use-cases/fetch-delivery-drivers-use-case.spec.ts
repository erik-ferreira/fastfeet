import { makeAdmin } from "@/test/factories/make-admin"
import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"

import { FetchDeliveryDriversUseCase } from "./fetch-delivery-drivers-use-case"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: FetchDeliveryDriversUseCase

describe("Fetch Delivery Drivers", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()

    sut = new FetchDeliveryDriversUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryDriverRepository,
    )
  })

  it("should be able to fetch delivery drivers", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

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
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.deliveryDrivers).toEqual([
        expect.objectContaining({ cpf: "10000000000" }),
        expect.objectContaining({ cpf: "20000000000" }),
        expect.objectContaining({ cpf: "30000000000" }),
        expect.objectContaining({ cpf: "40000000000" }),
      ])
    }
  })

  it("should be able to fetch paginated delivery drivers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryDriverRepository.create(
        makeDeliveryDriver({
          cpf: `${i}0000000000`,
        }),
      )
    }

    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      page: 2,
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.deliveryDrivers).toHaveLength(2)
    }
  })

  it("should not be possible to fetch for delivery drivers without being an admin", async () => {
    const deliveryDriverToFetch = makeDeliveryDriver({
      cpf: "40000000000",
    })

    const deliveryDriver1 = makeDeliveryDriver({
      cpf: "10000000000",
    })
    const deliveryDriver2 = makeDeliveryDriver({
      cpf: "20000000000",
    })
    const deliveryDriver3 = makeDeliveryDriver({
      cpf: "30000000000",
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver1)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver2)
    await inMemoryDeliveryDriverRepository.create(deliveryDriver3)

    const result = await sut.execute({
      page: 1,
      idResponsibleByRequest: deliveryDriverToFetch.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
