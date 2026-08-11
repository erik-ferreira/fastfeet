import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { makeRecipient } from "@/test/factories/make-recipient"

import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { DeleteRecipientUseCase } from "./delete-recipient-use-case"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: DeleteRecipientUseCase

describe("Delete Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository)
  })

  it("should be able to delete a recipient", async () => {
    const recipient = makeRecipient({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryRecipientRepository.create(recipient)

    await sut.execute({
      cpf: "10000000000",
    })

    expect(inMemoryRecipientRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a recipient not found", async () => {
    const result = await sut.execute({
      cpf: "10000000000",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
