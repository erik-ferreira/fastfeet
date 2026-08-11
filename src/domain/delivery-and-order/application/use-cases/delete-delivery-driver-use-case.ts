import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

interface DeleteDeliveryDriverUseCaseRequest {
  cpf: string
}

type DeleteDeliveryDriverUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDeliveryDriverUseCase {
  constructor(private deliveryDriversRepository: DeliveryDriversRepository) {}

  async execute({
    cpf,
  }: DeleteDeliveryDriverUseCaseRequest): Promise<DeleteDeliveryDriverUseCaseResponse> {
    const deliveryDriver = await this.deliveryDriversRepository.findByCpf(cpf)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryDriversRepository.delete(deliveryDriver)

    return right(null)
  }
}
