import { makeAdmin } from "@/test/factories/make-admin"

import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { CreateAdminUseCase } from "./create-admin"

let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher
let sut: CreateAdminUseCase

describe("Create Admin", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateAdminUseCase(inMemoryAdminRepository, fakeHasher)
  })

  it("should be able to create a admin", async () => {
    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminRepository.items).toHaveLength(1)
    expect(inMemoryAdminRepository.items).toEqual([
      expect.objectContaining({ cpf: Cpf.create("10000000000") }),
    ])
  })

  it("should not be able to create a admin with same cpf", async () => {
    const admin = makeAdmin({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      password: "123456",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})
