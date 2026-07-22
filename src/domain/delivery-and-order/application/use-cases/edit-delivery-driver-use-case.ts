import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"
import { AlreadyExistsError } from "./errors/already-exists-error"

interface EditDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
  name: string
  cpf: string
}

type EditDeliveryDriverUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | AlreadyExistsError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class EditDeliveryDriverUseCase {
  constructor(private deliveryDriversRepository: DeliveryDriversRepository) {}

  async execute({
    deliveryDriverId,
    name,
    cpf,
  }: EditDeliveryDriverUseCaseRequest): Promise<EditDeliveryDriverUseCaseResponse> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    const deliveryDriverWithTheSameCpf =
      await this.deliveryDriversRepository.findByCpf(cpf)

    if (
      deliveryDriverWithTheSameCpf &&
      deliveryDriverWithTheSameCpf.id.toString() !== deliveryDriverId
    ) {
      return left(new AlreadyExistsError("Delivery Driver", cpf))
    }

    deliveryDriver.name = name
    deliveryDriver.cpf = cpf

    await this.deliveryDriversRepository.update(deliveryDriver)

    return right({ deliveryDriver })
  }
}
