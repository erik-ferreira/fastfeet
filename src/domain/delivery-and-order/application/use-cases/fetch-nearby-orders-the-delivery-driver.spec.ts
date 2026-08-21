import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"

import { makeOrder } from "@/test/factories/make-order"

import { FetchNearbyOrdersTheDeliveryDriverUseCase } from "./fetch-nearby-orders-the-delivery-driver"

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchNearbyOrdersTheDeliveryDriverUseCase

describe("Fetch Nearby Orders", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new FetchNearbyOrdersTheDeliveryDriverUseCase(inMemoryOrderRepository)
  })

  it("should be able to fetch nearby orders the delivery driver", async () => {
    const positions = [
      {
        latitude: -3.8020771763482712,
        longitude: -38.50793415503423,
      },
      {
        latitude: -3.802323396427852,
        longitude: -38.5034602306139,
      },
      {
        latitude: -3.9019553853504783,
        longitude: -38.383507798758835,
      },
      {
        latitude: -3.9074996126052324,
        longitude: -38.431964576836,
      },
      {
        latitude: -3.937873161841236,
        longitude: -38.46790276496518,
      },
    ]

    for (let i = 0; i <= 4; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({
          title: `Order ${i}`,
          latitude: positions[i].latitude,
          longitude: positions[i].longitude,
        }),
      )
    }

    const result = await sut.execute({
      page: 1,
      user: {
        latitude: -3.7997871614286236,
        longitude: -38.51133222740375,
      },
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(2)
    }
  })
})
