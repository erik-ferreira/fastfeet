import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"

interface FetchDeliveryDriversUseCaseRequest {
  page: number
  idResponsibleByRequest: string
}

type FetchDeliveryDriversUseCaseResponse = Either<
  UnauthorizedError,
  {
    deliveryDrivers: DeliveryDriver[]
  }
>

@Injectable()
export class FetchDeliveryDriversUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    page,
    idResponsibleByRequest,
  }: FetchDeliveryDriversUseCaseRequest): Promise<FetchDeliveryDriversUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryDrivers = await this.deliveryDriversRepository.findMany({
      page,
    })

    return right({ deliveryDrivers })
  }
}
