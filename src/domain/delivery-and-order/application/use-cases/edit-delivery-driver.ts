import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

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
  ResourceNotFoundError,
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
      const deliveryDriverWithSameCpf =
        await this.deliveryDriversRepository.findByCpf(cpf)

      const isCpfBelongsToAnotherDeliveryDriver =
        deliveryDriverWithSameCpf &&
        !deliveryDriverWithSameCpf.id.equals(deliveryDriver.id)

      if (isCpfBelongsToAnotherDeliveryDriver) {
        return left(new AlreadyExistsError("Delivery Driver", cpf))
      }
    }

    deliveryDriver.update({
      name,
      cpf: cpf ? Cpf.create(cpf) : undefined,
    })

    await this.deliveryDriversRepository.save(deliveryDriver)

    return right({ deliveryDriver })
  }
}
