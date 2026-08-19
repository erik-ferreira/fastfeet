import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

interface FetchDeliveryDriversUseCaseRequest {
  page: number
}

type FetchDeliveryDriversUseCaseResponse = Either<
  null,
  {
    deliveryDrivers: DeliveryDriver[]
  }
>

@Injectable()
export class FetchDeliveryDriversUseCase {
  constructor(private deliveryDriversRepository: DeliveryDriversRepository) {}

  async execute({
    page,
  }: FetchDeliveryDriversUseCaseRequest): Promise<FetchDeliveryDriversUseCaseResponse> {
    const deliveryDrivers = await this.deliveryDriversRepository.findMany({
      page,
    })

    return right({ deliveryDrivers })
  }
}
