import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface GetOrderDetailsUseCaseRequest {
  orderId: string
}

type GetOrderDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class GetOrderDetailsUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    orderId,
  }: GetOrderDetailsUseCaseRequest): Promise<GetOrderDetailsUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({ order })
  }
}
