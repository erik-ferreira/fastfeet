import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"
import { User } from "../../enterprise/entities/user"
import { OperatorAlreadyExistsError } from "./errors/operator-already-exists-error"
import { HashGenerator } from "../cryptography/hash-generator"

interface CreateDeliveryDriverUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateDeliveryDriverUseCaseResponse = Either<
  OperatorAlreadyExistsError,
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
      return left(new OperatorAlreadyExistsError(cpf))
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
