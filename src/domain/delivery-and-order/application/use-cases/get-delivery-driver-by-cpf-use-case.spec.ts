import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { GetDeliveryDriverByCpfUseCase } from "./get-delivery-driver-by-cpf-use-case"
import { makeAdmin } from "@/test/factories/make-admin"

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: GetDeliveryDriverByCpfUseCase

describe("Get Delivery Driver By Cpf", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new GetDeliveryDriverByCpfUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryDriverRepository,
    )
  })

  it("should be able to get delivery driver by cpf", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const validCpfString = "10000000000"

    const deliveryDriver = makeDeliveryDriver({
      cpf: Cpf.create(validCpfString),
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      cpf: validCpfString,
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value).toMatchObject({
        deliveryDriver: expect.objectContaining({
          cpf: Cpf.create(validCpfString),
        }),
      })
    }
  })

  it("should not be able to get delivery driver by cpf", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      cpf: "10000000000",
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to get delivery driver without being an admin", async () => {
    const deliveryDriverToFetch = makeDeliveryDriver()

    const deliveryDriver = makeDeliveryDriver({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      cpf: "10000000000",
      idResponsibleByRequest: deliveryDriverToFetch.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
