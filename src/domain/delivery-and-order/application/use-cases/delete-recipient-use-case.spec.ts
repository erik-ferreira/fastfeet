import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeAdmin } from "@/test/factories/make-admin"
import { makeRecipient } from "@/test/factories/make-recipient"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { DeleteRecipientUseCase } from "./delete-recipient-use-case"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: DeleteRecipientUseCase

describe("Delete Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new DeleteRecipientUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientRepository,
    )
  })

  it("should be able to delete a recipient", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const recipient = makeRecipient({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryRecipientRepository.create(recipient)

    await sut.execute({
      cpf: "10000000000",
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(inMemoryRecipientRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a recipient not found", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      cpf: "10000000000",
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
