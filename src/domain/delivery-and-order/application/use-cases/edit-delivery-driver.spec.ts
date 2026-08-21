import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { EditDeliveryDriverUseCase } from "./edit-delivery-driver"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

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
        cpf: Cpf.create("10000000000"),
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      name: "Erik",
      cpf: "20000000000",
      deliveryDriverId: deliveryDriver.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryDriver: expect.objectContaining({
        name: "Erik",
        cpf: Cpf.create("20000000000"),
      }),
    })
  })

  it("should not be able to edit a non-existing delivery driver", async () => {
    const result = await sut.execute({
      deliveryDriverId: "non-existing-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to edit a delivery driver with the same cpf", async () => {
    const deliveryDriver1 = makeDeliveryDriver(
      {
        name: "John Doe 1",
        cpf: Cpf.create("10000000000"),
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    const deliveryDriver2 = makeDeliveryDriver(
      {
        name: "John Doe 2",
        cpf: Cpf.create("20000000000"),
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
      deliveryDriverId: deliveryDriver1.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it("should be able to edit a recipient with the same cpf of itself", async () => {
    const deliveryDriver = makeDeliveryDriver(
      {
        name: "John Doe 1",
        cpf: Cpf.create("10000000000"),
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      deliveryDriverId: deliveryDriver.id.toString(),
      name: "John Updated Name",
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.deliveryDriver.name).toBe("John Updated Name")
    }
  })
})
