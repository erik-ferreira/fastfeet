import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeAdmin } from "@/test/factories/make-admin"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { EditAdminUseCase } from "./edit-admin"

let inMemoryAdminRepository: InMemoryAdminRepository
let sut: EditAdminUseCase

describe("Edit Admin", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new EditAdminUseCase(inMemoryAdminRepository)
  })

  it("should be able to edit a admin", async () => {
    const admin = makeAdmin(
      {
        name: "John Doe",
        cpf: Cpf.create("10000000000"),
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      name: "Erik",
      cpf: "20000000000",
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: expect.objectContaining({
        name: "Erik",
        cpf: Cpf.create("20000000000"),
      }),
    })
  })

  it("should not be able to edit a non-existing admin", async () => {
    const result = await sut.execute({
      adminId: "non-existing-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to edit a admin with the same cpf", async () => {
    const admin1 = makeAdmin(
      {
        name: "John Doe 1",
        cpf: Cpf.create("10000000000"),
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    const admin2 = makeAdmin(
      {
        name: "John Doe 2",
        cpf: Cpf.create("20000000000"),
        password: "123456",
      },
      new UniqueEntityID("2"),
    )

    inMemoryAdminRepository.items.push(admin1, admin2)

    const result = await sut.execute({
      cpf: "20000000000",
      adminId: admin1.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it("should be able to edit a recipient with the same cpf of itself", async () => {
    const admin = makeAdmin(
      {
        name: "John Doe 1",
        cpf: Cpf.create("10000000000"),
        password: "123456",
      },
      new UniqueEntityID("1"),
    )

    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: "John Updated Name",
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.admin.name).toBe("John Updated Name")
    }
  })
})
