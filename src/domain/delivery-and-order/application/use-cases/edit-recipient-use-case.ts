import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

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
  ResourceNotFoundError | AlreadyExistsError,
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
      const recipientWithSameCpf = await this.recipientRepository.findByCpf(cpf)

      const isCpfBelongsToAnotherRecipient =
        recipientWithSameCpf && !recipientWithSameCpf.id.equals(recipient.id)

      if (isCpfBelongsToAnotherRecipient) {
        return left(new AlreadyExistsError("Recipient", cpf))
      }
    }

    recipient.update({
      name,
      cpf: cpf ? Cpf.create(cpf) : undefined,
      latitude,
      longitude,
    })

    await this.recipientRepository.save(recipient)

    return right({ recipient })
  }
}
