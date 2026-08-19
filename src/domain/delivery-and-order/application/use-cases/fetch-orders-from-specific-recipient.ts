import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface FetchOrdersFromSpecificRecipientUseCaseRequest {
  page: number
  recipientId: string
}

type FetchOrdersFromSpecificRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersFromSpecificRecipientUseCase {
  constructor(
    private ordersRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    page,
    recipientId,
  }: FetchOrdersFromSpecificRecipientUseCaseRequest): Promise<FetchOrdersFromSpecificRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const orders = await this.ordersRepository.findManyFromSpecificRecipient(
      recipientId,
      { page },
    )

    return right({ orders })
  }
}
