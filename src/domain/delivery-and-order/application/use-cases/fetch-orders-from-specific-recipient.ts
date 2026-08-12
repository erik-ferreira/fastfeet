import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

interface FetchOrdersFromSpecificRecipientUseCaseRequest {
  page: number
  recipientId: string
}

type FetchOrdersFromSpecificRecipientUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersFromSpecificRecipientUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    page,
    recipientId,
  }: FetchOrdersFromSpecificRecipientUseCaseRequest): Promise<FetchOrdersFromSpecificRecipientUseCaseResponse> {
    const orders = await this.ordersRepository.findManyFromSpecificRecipient(
      recipientId,
      { page },
    )

    return right({ orders })
  }
}
