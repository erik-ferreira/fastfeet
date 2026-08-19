import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface GetRecipientByCpfUseCaseRequest {
  cpf: string
}

type GetRecipientByCpfUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientByCpfUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    cpf,
  }: GetRecipientByCpfUseCaseRequest): Promise<GetRecipientByCpfUseCaseResponse> {
    const recipient = await this.recipientRepository.findByCpf(cpf)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({ recipient })
  }
}
