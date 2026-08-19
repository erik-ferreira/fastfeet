import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { makeRecipient } from "@/test/factories/make-recipient"

import { CreateRecipientUseCase } from "./create-recipient-use-case"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe("Create Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
  })

  it("should be able to create a recipient", async () => {
    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      latitude: -3.7997858019618707,
      longitude: -38.5113046020789,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
    expect(inMemoryRecipientRepository.items).toEqual([
      expect.objectContaining({ cpf: Cpf.create("10000000000") }),
    ])
  })

  it("should not be able to create a delivery driver with same cpf", async () => {
    const recipient = makeRecipient({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      latitude: -3.7997858019618707,
      longitude: -38.5113046020789,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})
