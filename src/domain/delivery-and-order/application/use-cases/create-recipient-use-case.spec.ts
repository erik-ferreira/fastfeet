import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

import { makeAdmin } from "@/test/factories/make-admin"
import { makeRecipient } from "@/test/factories/make-recipient"

import { CreateRecipientUseCase } from "./create-recipient-use-case"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: CreateRecipientUseCase

describe("Create Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new CreateRecipientUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientRepository,
    )
  })

  it("should be able to create a recipient", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      latitude: -3.7997858019618707,
      longitude: -38.5113046020789,
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
    expect(inMemoryRecipientRepository.items).toEqual([
      expect.objectContaining({ cpf: Cpf.create("10000000000") }),
    ])
  })

  it("should not be able to create a delivery driver with same cpf", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const recipient = makeRecipient({
      cpf: Cpf.create("10000000000"),
    })

    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      name: "John Doe",
      cpf: "10000000000",
      latitude: -3.7997858019618707,
      longitude: -38.5113046020789,
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})
