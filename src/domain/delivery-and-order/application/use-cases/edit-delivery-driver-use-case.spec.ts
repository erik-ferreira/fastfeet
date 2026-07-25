import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { EditDeliveryDriverUseCase } from "./edit-delivery-driver-use-case"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: EditDeliveryDriverUseCase

describe("Edit Delivery Driver", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new EditDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to edit a delivery driver", async () => {
    const deliveryDriver = makeDeliveryDriver(
      {
        name: "John Doe",
        cpf: "10000000000",
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      name: "Erik",
      cpf: "20000000000",
      deliveryDriverId: new UniqueEntityID("1").toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryDriver: expect.objectContaining({
        name: "Erik",
        cpf: "20000000000",
      }),
    })
  })

  it("should not be able to edit a delivery driver with the same cpf", async () => {
    const deliveryDriver1 = makeDeliveryDriver(
      {
        name: "John Doe 1",
        cpf: "10000000000",
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    const deliveryDriver2 = makeDeliveryDriver(
      {
        name: "John Doe 2",
        cpf: "20000000000",
        password: "123456",
      },
      new UniqueEntityID("2"),
    )

    inMemoryDeliveryDriverRepository.items.push(
      deliveryDriver1,
      deliveryDriver2,
    )

    const result = await sut.execute({
      cpf: "20000000000",
      deliveryDriverId: new UniqueEntityID("1").toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})
