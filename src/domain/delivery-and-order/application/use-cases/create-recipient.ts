import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { AlreadyExistsError } from "./errors/already-exists-error"

interface CreateRecipientUseCaseRequest {
  name: string
  cpf: string
  latitude: number
  longitude: number
}

type CreateRecipientUseCaseResponse = Either<
  AlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    cpf,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipientWithSameCpf = await this.recipientRepository.findByCpf(cpf)

    if (recipientWithSameCpf) {
      return left(new AlreadyExistsError("Recipient", cpf))
    }

    const recipient = Recipient.create({
      cpf: Cpf.create(cpf),
      name,
      latitude,
      longitude,
    })

    await this.recipientRepository.create(recipient)

    return right({ recipient })
  }
}
