import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface EditOrderUseCaseRequest {
  orderId: string
  title: string
  latitude: number
  longitude: number
  recipientId: string
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    orderId,
    title,
    latitude,
    longitude,
    recipientId,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status === "DELIVERED" || order.status === "RETURNED") {
      return left(new NotAllowedError())
    }

    order.update({
      title,
      latitude,
      longitude,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
