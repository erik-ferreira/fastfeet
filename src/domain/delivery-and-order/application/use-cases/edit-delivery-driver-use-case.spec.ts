import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { UnauthorizedError } from "@/core/errors/unauthorized-error"

import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { EditDeliveryDriverUseCase } from "./edit-delivery-driver-use-case"
import { makeAdmin } from "@/test/factories/make-admin"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: EditDeliveryDriverUseCase

describe("Edit Delivery Driver", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new EditDeliveryDriverUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryDriverRepository,
    )
  })

  it("should be able to edit a delivery driver", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

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
      idResponsibleByRequest: admin.id.toString(),
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
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

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
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it("should not be possible to edit delivery driver without begin an admin", async () => {
    const deliveryDriverToFetch = makeDeliveryDriver({})

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
      idResponsibleByRequest: deliveryDriverToFetch.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
