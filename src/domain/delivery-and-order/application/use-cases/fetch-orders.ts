import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

interface FetchOrdersDetailsUseCaseRequest {
  page: number
}

type FetchOrdersDetailsUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    page,
  }: FetchOrdersDetailsUseCaseRequest): Promise<FetchOrdersDetailsUseCaseResponse> {
    const orders = await this.ordersRepository.findMany({ page })

    return right({ orders })
  }
}
