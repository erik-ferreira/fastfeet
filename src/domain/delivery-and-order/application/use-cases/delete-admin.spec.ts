import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeAdmin } from "@/test/factories/make-admin"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"

import { DeleteAdminUseCase } from "./delete-admin"

let inMemoryAdminRepository: InMemoryAdminRepository
let sut: DeleteAdminUseCase

describe("Delete Admin", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new DeleteAdminUseCase(inMemoryAdminRepository)
  })

  it("should be able to delete a admin", async () => {
    const admin = makeAdmin({}, new UniqueEntityID("1"))

    await inMemoryAdminRepository.create(admin)

    await sut.execute({
      id: "1",
    })

    expect(inMemoryAdminRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a admin not found", async () => {
    const result = await sut.execute({
      id: "1",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
