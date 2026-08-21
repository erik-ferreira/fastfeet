import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { makeOrder } from "@/test/factories/make-order"

import { FetchOrdersUseCase } from "./fetch-orders"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrdersUseCase

describe("Fetch Orders", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new FetchOrdersUseCase(inMemoryOrderRepository)
  })

  it("should be able to fetch orders", async () => {
    for (let i = 1; i <= 4; i++) {
      await inMemoryOrderRepository.create(makeOrder({ title: `Order ${i}` }))
    }

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(4)
    }
  })

  it("should be able to fetch paginated orders", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOrderRepository.create(makeOrder({ title: `Order ${i}` }))
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(2)
    }
  })
})
