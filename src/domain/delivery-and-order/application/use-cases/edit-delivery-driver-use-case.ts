import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { AlreadyExistsError } from "./errors/already-exists-error"

interface EditDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
  name?: string
  cpf?: string
  idResponsibleByRequest: string
}

type EditDeliveryDriverUseCaseResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | AlreadyExistsError
  | UnauthorizedError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class EditDeliveryDriverUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    deliveryDriverId,
    name,
    cpf,
    idResponsibleByRequest,
  }: EditDeliveryDriverUseCaseRequest): Promise<EditDeliveryDriverUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    if (cpf) {
      const deliveryDriverWithTheSameCpf =
        await this.deliveryDriversRepository.findByCpf(cpf)

      if (
        deliveryDriverWithTheSameCpf &&
        deliveryDriverWithTheSameCpf.id.toString() !== deliveryDriverId
      ) {
        return left(new AlreadyExistsError("Delivery Driver", cpf))
      }

      deliveryDriver.cpf = cpf
    }

    if (name) {
      deliveryDriver.name = name
    }

    await this.deliveryDriversRepository.update(deliveryDriver)

    return right({ deliveryDriver })
  }
}
