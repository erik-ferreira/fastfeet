import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface GetDeliveryDriverByCpfUseCaseRequest {
  cpf: string
  idResponsibleByRequest: string
}

type GetDeliveryDriverByCpfUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class GetDeliveryDriverByCpfUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    cpf,
    idResponsibleByRequest,
  }: GetDeliveryDriverByCpfUseCaseRequest): Promise<GetDeliveryDriverByCpfUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryDriver = await this.deliveryDriversRepository.findByCpf(cpf)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    return right({ deliveryDriver })
  }
}
