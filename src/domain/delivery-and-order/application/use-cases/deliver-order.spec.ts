import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeOrder } from "@/test/factories/make-order"
import { makeDeliveryDriver } from "@/test/factories/make-delivery-driver"
import { makeOrderAttachment } from "@/test/factories/make-order-attachment"

import { InMemoryOrderRepository } from "@/test/repositories/in-memory-order-repository"
import { InMemoryDeliveryDriverRepository } from "@/test/repositories/in-memory-delivery-driver-repository"
import { InMemoryOrderAttachmentRepository } from "@/test/repositories/in-memory-order-attachment-repository"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { DeliverOrderUseCase } from "./deliver-order-use-case"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: DeliverOrderUseCase

describe("Deliver Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    sut = new DeliverOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryDriverRepository,
      inMemoryOrderAttachmentRepository,
    )
  })

  it("should be able to mark order as DELIVERED", async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityID("driver-1"),
    )
    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const orderAttachment = makeOrderAttachment(
      {},
      new UniqueEntityID("order-attachment-1"),
    )
    await inMemoryOrderAttachmentRepository.createMany([orderAttachment])

    const order = makeOrder(
      {
        status: "WITHDRAWN",
        attachmentId: orderAttachment.id,
        deliveryDriverId: deliveryDriver.id,
      },
      new UniqueEntityID("1"),
    )
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliveryDriverId: deliveryDriver.id.toString(),
      attachmentId: orderAttachment.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderRepository.items).toEqual([
      expect.objectContaining({ status: "DELIVERED" }),
    ])
  })

  it("should not be able to mark order as DELIVERED with delivery driver not found", async () => {
    const order = makeOrder({ status: "WITHDRAWN" }, new UniqueEntityID("1"))

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryDriverId: "id-non-existing",
      attachmentId: "attachment-id-non-existing",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to mark order as DELIVERED with order not found", async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityID("driver-1"),
    )
    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const order = makeOrder(
      {
        status: "WITHDRAWN",
        deliveryDriverId: deliveryDriver.id,
      },
      new UniqueEntityID("1"),
    )

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryDriverId: deliveryDriver.id.toString(),
      attachmentId: "attachment-id-non-existing",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to mark order as DELIVERED if the order status is anything other than WITHDRAWN", async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityID("driver-1"),
    )
    await inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const orderAttachment = makeOrderAttachment(
      {},
      new UniqueEntityID("order-attachment-1"),
    )
    await inMemoryOrderAttachmentRepository.createMany([orderAttachment])

    const order = makeOrder(
      {
        attachmentId: orderAttachment.id,
        deliveryDriverId: deliveryDriver.id,
      },
      new UniqueEntityID("1"),
    )
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliveryDriverId: deliveryDriver.id.toString(),
      attachmentId: orderAttachment.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(NotAllowedError)
  })
})
