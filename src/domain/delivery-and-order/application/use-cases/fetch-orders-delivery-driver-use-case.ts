import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

interface FetchOrdersDeliveryDriverUseCaseRequest {
  page: number
  deliveryDriverId: string
}

type FetchOrdersDeliveryDriverUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersDeliveryDriverUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    page,
    deliveryDriverId,
  }: FetchOrdersDeliveryDriverUseCaseRequest): Promise<FetchOrdersDeliveryDriverUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByDeliveryDriver(
      deliveryDriverId,
      { page },
    )

    return right({ orders })
  }
}
