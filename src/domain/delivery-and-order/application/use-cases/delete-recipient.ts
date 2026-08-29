import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

interface DeleteRecipientUseCaseRequest {
  id: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    id,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(id)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
