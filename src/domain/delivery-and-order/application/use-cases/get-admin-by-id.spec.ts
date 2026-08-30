import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeAdmin } from "@/test/factories/make-admin"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"

import { GetAdminByIdUseCase } from "./get-admin-by-id"

let inMemoryAdminRepository: InMemoryAdminRepository
let sut: GetAdminByIdUseCase

describe("Get Admin By Id", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new GetAdminByIdUseCase(inMemoryAdminRepository)
  })

  it("should be able to get admin by id", async () => {
    const validIdString = "10000000000"

    const admin = makeAdmin({}, new UniqueEntityID(validIdString))

    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      id: validIdString,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value).toMatchObject({
        admin: expect.objectContaining({
          id: validIdString,
        }),
      })
    }
  })

  it("should not be able to get admin by id", async () => {
    const result = await sut.execute({
      id: "10000000000",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
