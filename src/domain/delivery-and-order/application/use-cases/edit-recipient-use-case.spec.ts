import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeRecipient } from "@/test/factories/make-recipient"

import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { EditRecipientUseCase } from "./edit-recipient-use-case"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: EditRecipientUseCase

describe("Edit Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientRepository)
  })

  it("should be able to edit a recipient", async () => {
    const recipient = makeRecipient(
      {
        name: "John Doe",
        cpf: Cpf.create("10000000000"),
        latitude: -3.7997858019618707,
        longitude: -38.5113046020789,
      },
      new UniqueEntityID("1"),
    )

    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      name: "Erik",
      cpf: "20000000000",
      recipientId: new UniqueEntityID("1").toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: expect.objectContaining({
        name: "Erik",
        cpf: "20000000000",
      }),
    })
  })

  it("should not be able to edit a recipient with the same cpf", async () => {
    const recipient1 = makeRecipient(
      {
        name: "John Doe 1",
        cpf: Cpf.create("10000000000"),
        latitude: -3.7997858019618707,
        longitude: -38.5113046020789,
      },
      new UniqueEntityID("1"),
    )

    const recipient2 = makeRecipient(
      {
        name: "John Doe 2",
        cpf: Cpf.create("20000000000"),
        latitude: -3.7997858019618707,
        longitude: -38.5113046020789,
      },
      new UniqueEntityID("2"),
    )

    inMemoryRecipientRepository.items.push(recipient1, recipient2)

    const result = await sut.execute({
      cpf: "20000000000",
      recipientId: new UniqueEntityID("1").toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})
