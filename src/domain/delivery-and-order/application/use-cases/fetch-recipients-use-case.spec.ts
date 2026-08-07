import { makeAdmin } from "@/test/factories/make-admin"
import { makeRecipient } from "@/test/factories/make-recipient"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"
import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"

import { FetchRecipientsUseCase } from "./fetch-recipients-use-case"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: FetchRecipientsUseCase

describe("Fetch Recipients", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()

    sut = new FetchRecipientsUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientRepository,
    )
  })

  it("should be able to fetch recipients", async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const recipient1 = makeRecipient({
      cpf: Cpf.create("10000000000"),
    })
    const recipient2 = makeRecipient({
      cpf: Cpf.create("20000000000"),
    })
    const recipient3 = makeRecipient({
      cpf: Cpf.create("30000000000"),
    })
    const recipient4 = makeRecipient({
      cpf: Cpf.create("40000000000"),
    })

    await inMemoryRecipientRepository.create(recipient1)
    await inMemoryRecipientRepository.create(recipient2)
    await inMemoryRecipientRepository.create(recipient3)
    await inMemoryRecipientRepository.create(recipient4)

    const result = await sut.execute({
      page: 1,
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.recipients).toEqual([
        expect.objectContaining({ cpf: recipient4.cpf }),
        expect.objectContaining({ cpf: recipient3.cpf }),
        expect.objectContaining({ cpf: recipient2.cpf }),
        expect.objectContaining({ cpf: recipient1.cpf }),
      ])
    }
  })

  it("should be able to fetch paginated recipients", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientRepository.create(
        makeRecipient({
          cpf: Cpf.create(i <= 9 ? `0${i}000000000` : `${i}000000000`),
        }),
      )
    }

    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      page: 2,
      idResponsibleByRequest: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.recipients).toHaveLength(2)
    }
  })
})
