import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

interface FetchNearbyOrdersTheDeliveryDriverUseCaseRequest {
  page: number
  user: {
    latitude: number
    longitude: number
  }
}

type FetchNearbyOrdersTheDeliveryDriverUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchNearbyOrdersTheDeliveryDriverUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    page,
    user: { latitude, longitude },
  }: FetchNearbyOrdersTheDeliveryDriverUseCaseRequest): Promise<FetchNearbyOrdersTheDeliveryDriverUseCaseResponse> {
    const orders = await this.ordersRepository.findManyNearby({
      page,
      latitude,
      longitude,
    })

    return right({ orders })
  }
}
