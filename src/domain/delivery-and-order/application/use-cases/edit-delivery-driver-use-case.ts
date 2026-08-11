import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { AlreadyExistsError } from "./errors/already-exists-error"

interface EditDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
  name?: string
  cpf?: string
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

    if (cpf) {
      const newCpf = Cpf.create(cpf)

      const deliveryDriverWithTheSameCpf =
        await this.deliveryDriversRepository.findByCpf(newCpf.raw)

      if (
        deliveryDriverWithTheSameCpf &&
        !deliveryDriverWithTheSameCpf.id.equals(deliveryDriver.id)
      ) {
        return left(new AlreadyExistsError("Delivery Driver", cpf))
      }

      deliveryDriver.cpf = newCpf
    }

    if (name) {
      deliveryDriver.name = name
    }

    await this.deliveryDriversRepository.update(deliveryDriver)

    return right({ deliveryDriver })
  }
}
