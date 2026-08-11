import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import {
  Order,
  OrderStatus,
} from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"

interface CreateOrderUseCaseRequest {
  title: string
  status: OrderStatus
  latitude: number
  longitude: number

  recipientId: string
  deliveryDriverId?: string
  attachmentId?: string

  idResponsibleByRequest: string
}

type CreateOrderUseCaseResponse = Either<
  UnauthorizedError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private ordersRepository: OrderRepository,
  ) {}

  async execute({
    title,
    status,
    latitude,
    longitude,
    recipientId,
    deliveryDriverId,
    attachmentId,

    idResponsibleByRequest,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const order = Order.create({
      title,
      status,
      latitude,
      longitude,
      recipientId: new UniqueEntityID(recipientId),
      deliveryDriverId: deliveryDriverId
        ? new UniqueEntityID(deliveryDriverId)
        : null,
      attachmentId: attachmentId ? new UniqueEntityID(attachmentId) : null,
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
