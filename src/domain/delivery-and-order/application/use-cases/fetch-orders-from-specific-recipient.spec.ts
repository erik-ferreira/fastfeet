import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "@/test/repositories/in-memory-recipient-repository"

import { makeOrder } from "@/test/factories/make-order"
import { makeRecipient } from "@/test/factories/make-recipient"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { FetchOrdersFromSpecificRecipientUseCase } from "./fetch-orders-from-specific-recipient"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: FetchOrdersFromSpecificRecipientUseCase

describe("Fetch Orders From Specific Recipient", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new FetchOrdersFromSpecificRecipientUseCase(
      inMemoryOrderRepository,
      inMemoryRecipientRepository,
    )
  })

  it("should be able to fetch orders from specific recipient", async () => {
    const recipient = makeRecipient({})
    await inMemoryRecipientRepository.create(recipient)

    for (let i = 1; i <= 4; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({
          title: `Order ${i}`,
          recipientId: recipient.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 1,
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(4)
    }
  })

  it("should not be able to fetch orders from recipient not found", async () => {
    const result = await sut.execute({
      page: 1,
      recipientId: "id-non-existing",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should be able to fetch orders from specific recipient and list is empty", async () => {
    const recipient = makeRecipient({})
    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      page: 1,
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(0)
    }
  })
})
