import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"

import { HashGenerator } from "../cryptography/hash-generator"
import { AlreadyExistsError } from "./errors/already-exists-error"

interface CreateDeliveryDriverUseCaseRequest {
  name: string
  cpf: string
  password: string

  idResponsibleByRequest: string
}

type CreateDeliveryDriverUseCaseResponse = Either<
  AlreadyExistsError | UnauthorizedError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class CreateDeliveryDriverUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryDriversRepository: DeliveryDriversRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,

    idResponsibleByRequest,
  }: CreateDeliveryDriverUseCaseRequest): Promise<CreateDeliveryDriverUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryDriverWithSameCpf =
      await this.deliveryDriversRepository.findByCpf(cpf)

    if (deliveryDriverWithSameCpf) {
      return left(new AlreadyExistsError("User", cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryDriver = DeliveryDriver.create({
      cpf: Cpf.create(cpf),
      name,
      password: hashedPassword,
    })

    await this.deliveryDriversRepository.create(deliveryDriver)

    return right({ deliveryDriver })
  }
}
