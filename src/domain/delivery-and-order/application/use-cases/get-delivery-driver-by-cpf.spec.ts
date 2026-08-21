import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { GetDeliveryDriverByCpfUseCase } from "./get-delivery-driver-by-cpf"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: GetDeliveryDriverByCpfUseCase

describe("Get Delivery Driver By Cpf", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new GetDeliveryDriverByCpfUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to get delivery driver by cpf", async () => {
    const validCpfString = "10000000000"

    const deliveryDriver = makeDeliveryDriver({
      cpf: Cpf.create(validCpfString),
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      cpf: validCpfString,
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
    const result = await sut.execute({
      cpf: "10000000000",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
