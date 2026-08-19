import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"
import { OrderAttachmentRepository } from "@/domain/delivery-and-order/application/repositories/order-attachment-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

interface DeliverOrderUseCaseRequest {
  orderId: string
  deliveryDriverId: string
  attachmentId: string
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    private ordersRepository: OrderRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
    private orderAttachmentRepository: OrderAttachmentRepository,
  ) {}

  async execute({
    orderId,
    deliveryDriverId,
    attachmentId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (
      order.status !== "WITHDRAWN" ||
      !order.deliveryDriverId ||
      !order.deliveryDriverId.equals(new UniqueEntityID(deliveryDriverId))
    ) {
      return left(new NotAllowedError())
    }

    const attachment =
      await this.orderAttachmentRepository.findManyByOrderId(orderId)

    if (!attachment) {
      return left(new ResourceNotFoundError())
    }

    order.deliver(new UniqueEntityID(attachmentId))

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
