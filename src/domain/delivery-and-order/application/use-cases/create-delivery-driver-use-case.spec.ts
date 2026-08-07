import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { makeAdmin } from "@/test/factories/make-admin"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { CreateDeliveryDriverUseCase } from "./create-delivery-driver-use-case"

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let fakeHasher: FakeHasher
let sut: CreateDeliveryDriverUseCase

describe("Create Delivery Driver", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateDeliveryDriverUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryDriverRepository,
      fakeHasher,
    )
  })

  it("should be able to create a delivery driver", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      password: "123456",

      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryDriverRepository.items).toHaveLength(1)
    expect(inMemoryDeliveryDriverRepository.items).toEqual([
      expect.objectContaining({ cpf: "10000000000" }),
    ])
  })

  it("should not be able to create a delivery driver with same cpf", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const deliveryDriver = makeDeliveryDriver({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      password: "123456",

      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it("should not be able to create a delivery driver without being an admin", async () => {
    const deliveryDriverToFetch = makeDeliveryDriver()

    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      password: "123456",

      idResponsibleByRequest: deliveryDriverToFetch.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
