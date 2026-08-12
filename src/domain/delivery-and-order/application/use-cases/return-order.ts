import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface ReturnOrderUseCaseRequest {
  orderId: string
}

type ReturnOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.returnOrder()

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
