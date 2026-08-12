import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface WithdrawOrderUseCaseRequest {
  orderId: string
  deliveryDriverId: string
}

type WithdrawOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class WithdrawOrderUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    orderId,
    deliveryDriverId,
  }: WithdrawOrderUseCaseRequest): Promise<WithdrawOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.withdraw(new UniqueEntityID(deliveryDriverId))

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
