import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { makeRecipient } from "@/test/factories/make-recipient"

import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { GetRecipientByCpfUseCase } from "./get-recipient-by-cpf"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: GetRecipientByCpfUseCase

describe("Get Recipient By Cpf", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new GetRecipientByCpfUseCase(inMemoryRecipientRepository)
  })

  it("should be able to get recipient by cpf", async () => {
    const validCpfString = "10000000000"

    const recipient = makeRecipient({
      cpf: Cpf.create(validCpfString),
    })

    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      cpf: validCpfString,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value).toMatchObject({
        recipient: expect.objectContaining({
          cpf: Cpf.create(validCpfString),
        }),
      })
    }
  })

  it("should not be able to get recipient by cpf", async () => {
    const result = await sut.execute({
      cpf: "10000000000",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
