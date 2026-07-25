import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { GetDeliveryDriverByCpfUseCase } from "./get-delivery-driver-by-cpf-use-case"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: GetDeliveryDriverByCpfUseCase

describe("Get Delivery Driver By Cpf", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new GetDeliveryDriverByCpfUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to get delivery driver by cpf", async () => {
    const deliveryDriver = makeDeliveryDriver({
      cpf: "10000000000",
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({ cpf: "10000000000" })

    expect(result.value).toMatchObject({
      deliveryDriver: expect.objectContaining({
        cpf: "10000000000",
      }),
    })
  })

  it("should not be able to get delivery driver by cpf", async () => {
    const result = await sut.execute({ cpf: "10000000000" })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
