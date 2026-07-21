import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

interface GetDeliveryDriverByCpfUseCaseRequest {
  cpf: string
}

type GetDeliveryDriverByCpfUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class GetDeliveryDriverByCpfUseCase {
  constructor(private deliveryDriversRepository: DeliveryDriversRepository) {}

  async execute({
    cpf,
  }: GetDeliveryDriverByCpfUseCaseRequest): Promise<GetDeliveryDriverByCpfUseCaseResponse> {
    const deliveryDriver = await this.deliveryDriversRepository.findByCpf(cpf)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    return right({ deliveryDriver })
  }
}
