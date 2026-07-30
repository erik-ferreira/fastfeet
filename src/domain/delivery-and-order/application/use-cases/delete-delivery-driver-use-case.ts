import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

interface DeleteDeliveryDriverUseCaseRequest {
  cpf: string
  idResponsibleByRequest: string
}

type DeleteDeliveryDriverUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDeliveryDriverUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    cpf,
    idResponsibleByRequest,
  }: DeleteDeliveryDriverUseCaseRequest): Promise<DeleteDeliveryDriverUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryDriver = await this.deliveryDriversRepository.findByCpf(cpf)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryDriversRepository.delete(deliveryDriver)

    return right(null)
  }
}
