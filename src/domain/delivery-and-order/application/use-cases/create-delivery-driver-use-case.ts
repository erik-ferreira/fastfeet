import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { User } from "@/domain/delivery-and-order/enterprise/entities/user"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { HashGenerator } from "../cryptography/hash-generator"
import { AlreadyExistsError } from "./errors/already-exists-error"

interface CreateDeliveryDriverUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateDeliveryDriverUseCaseResponse = Either<
  AlreadyExistsError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class CreateDeliveryDriverUseCase {
  constructor(
    private deliveryDriversRepository: DeliveryDriversRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: CreateDeliveryDriverUseCaseRequest): Promise<CreateDeliveryDriverUseCaseResponse> {
    const deliveryDriverWithSameCpf =
      await this.deliveryDriversRepository.findByCpf(cpf)

    if (deliveryDriverWithSameCpf) {
      return left(new AlreadyExistsError("User", cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryDriver = User.create({
      cpf,
      name,
      password: hashedPassword,
    })

    await this.deliveryDriversRepository.create(deliveryDriver)

    return right({ deliveryDriver })
  }
}
