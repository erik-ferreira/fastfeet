import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface DeliverOrderUseCaseRequest {
  orderId: string
  deliveryDriverId: string
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    orderId,
    deliveryDriverId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.deliver(new UniqueEntityID(deliveryDriverId))

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
