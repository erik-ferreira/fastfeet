import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import {
  Order,
  OrderStatus,
} from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

interface CreateOrderUseCaseRequest {
  title: string
  status: OrderStatus
  latitude: number
  longitude: number

  recipientId: string
  deliveryDriverId?: string
  attachmentId?: string
}

type CreateOrderUseCaseResponse = Either<
  null,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    title,
    status,
    latitude,
    longitude,
    recipientId,
    deliveryDriverId,
    attachmentId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      title,
      status,
      latitude,
      longitude,
      recipientId: new UniqueEntityID(recipientId),
      deliveryDriverId: deliveryDriverId
        ? new UniqueEntityID(deliveryDriverId)
        : null,
      attachmentId: attachmentId ? new UniqueEntityID(attachmentId) : null,
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
