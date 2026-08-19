import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface FetchOrdersDeliveryDriverUseCaseRequest {
  page: number
  deliveryDriverId: string
}

type FetchOrdersDeliveryDriverUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersDeliveryDriverUseCase {
  constructor(
    private ordersRepository: OrderRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    page,
    deliveryDriverId,
  }: FetchOrdersDeliveryDriverUseCaseRequest): Promise<FetchOrdersDeliveryDriverUseCaseResponse> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    const orders = await this.ordersRepository.findManyByDeliveryDriver(
      deliveryDriverId,
      { page },
    )

    return right({ orders })
  }
}
