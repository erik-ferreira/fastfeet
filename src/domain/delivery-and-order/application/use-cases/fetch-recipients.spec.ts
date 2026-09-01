import { makeRecipient } from "@/test/factories/make-recipient"

import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { FetchRecipientsUseCase } from "./fetch-recipients"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: FetchRecipientsUseCase

describe("Fetch Recipients", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new FetchRecipientsUseCase(inMemoryRecipientRepository)
  })

  it("should be able to fetch recipients", async () => {
    await inMemoryRecipientRepository.create(
      makeRecipient({
        createdAt: new Date(2026, 0, 20),
      }),
    )
    await inMemoryRecipientRepository.create(
      makeRecipient({
        createdAt: new Date(2026, 0, 18),
      }),
    )
    await inMemoryRecipientRepository.create(
      makeRecipient({
        createdAt: new Date(2026, 0, 23),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.recipients).toEqual([
        expect.objectContaining({ createdAt: new Date(2026, 0, 23) }),
        expect.objectContaining({ createdAt: new Date(2026, 0, 20) }),
        expect.objectContaining({ createdAt: new Date(2026, 0, 18) }),
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

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.recipients).toHaveLength(2)
    }
  })
})
