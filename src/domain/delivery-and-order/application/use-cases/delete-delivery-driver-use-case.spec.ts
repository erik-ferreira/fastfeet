import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeAdmin } from "@/test/factories/make-admin"
import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { DeleteDeliveryDriverUseCase } from "./delete-delivery-driver-use-case"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: DeleteDeliveryDriverUseCase

describe("Delete Delivery Driver", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new DeleteDeliveryDriverUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryDriverRepository,
    )
  })

  it("should be able to delete a delivery driver", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const deliveryDriver = makeDeliveryDriver({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    await sut.execute({
      cpf: "10000000000",
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(inMemoryDeliveryDriverRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a delivery driver not found", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      cpf: "10000000000",
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be possible to delete a delivery driver without begin an admin", async () => {
    const deliveryDriverToFetch = makeDeliveryDriver()

    const deliveryDriverToDelete = makeDeliveryDriver()

    await inMemoryDeliveryDriverRepository.create(deliveryDriverToDelete)

    const result = await sut.execute({
      cpf: deliveryDriverToDelete.cpf.raw,
      idResponsibleByRequest: deliveryDriverToFetch.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
