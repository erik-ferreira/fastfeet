import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { DeleteDeliveryDriverUseCase } from "./delete-delivery-driver-use-case"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: DeleteDeliveryDriverUseCase

describe("Delete Delivery Driver", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new DeleteDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to delete a delivery driver", async () => {
    const deliveryDriver = makeDeliveryDriver({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    await sut.execute({
      cpf: "10000000000",
    })

    expect(inMemoryDeliveryDriverRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a delivery driver not found", async () => {
    const result = await sut.execute({
      cpf: "10000000000",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
