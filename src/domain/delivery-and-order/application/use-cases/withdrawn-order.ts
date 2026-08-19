import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface WithdrawnOrderUseCaseRequest {
  orderId: string
  deliveryDriverId: string
}

type WithdrawnOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class WithdrawnOrderUseCase {
  constructor(
    private ordersRepository: OrderRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    orderId,
    deliveryDriverId,
  }: WithdrawnOrderUseCaseRequest): Promise<WithdrawnOrderUseCaseResponse> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.withdrawn(new UniqueEntityID(deliveryDriverId))

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
