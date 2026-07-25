import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"

import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"

import { DeleteDeliveryDriverUseCase } from "./delete-delivery-driver-use-case"

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: DeleteDeliveryDriverUseCase

describe("Delete Delivery Driver", () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    sut = new DeleteDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it("should be able to delete a delivery driver", async () => {
    const deliveryDriver = makeDeliveryDriver({
      cpf: "10000000000",
    })

    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    await sut.execute({ cpf: "10000000000" })

    expect(inMemoryDeliveryDriverRepository.items).toHaveLength(0)
  })
})
