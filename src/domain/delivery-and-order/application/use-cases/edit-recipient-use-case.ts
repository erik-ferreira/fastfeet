import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { AlreadyExistsError } from "./errors/already-exists-error"

interface EditRecipientUseCaseRequest {
  recipientId: string
  name?: string
  cpf?: string
  latitude?: number
  longitude?: number
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | AlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
    name,
    cpf,
    latitude,
    longitude,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    if (cpf) {
      const newCpf = Cpf.create(cpf)

      const recipientWithTheSameCpf = await this.recipientRepository.findByCpf(
        newCpf.raw,
      )

      if (
        recipientWithTheSameCpf &&
        !recipientWithTheSameCpf.id.equals(recipient.id)
      ) {
        return left(new AlreadyExistsError("Recipient", cpf))
      }

      recipient.cpf = newCpf
    }

    if (name) {
      recipient.name = name
    }

    if (latitude !== undefined) {
      recipient.latitude = latitude
    }

    if (longitude !== undefined) {
      recipient.longitude = longitude
    }

    await this.recipientRepository.update(recipient)

    return right({ recipient })
  }
}
