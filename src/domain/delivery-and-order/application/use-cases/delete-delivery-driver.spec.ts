import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { DeleteDeliveryDriverUseCase } from "./delete-delivery-driver"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: DeleteDeliveryDriverUseCase

describe("Delete Delivery Driver", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new DeleteDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to delete a delivery driver", async () => {
    const deliveryDriver = makeDeliveryDriver({}, new UniqueEntityID("1"))

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    await sut.execute({
      id: "1",
    })

    expect(inMemoryDeliveryDriverRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a delivery driver not found", async () => {
    const result = await sut.execute({
      id: "1",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
