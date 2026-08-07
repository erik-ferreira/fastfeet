import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

interface DeleteRecipientUseCaseRequest {
  cpf: string
  idResponsibleByRequest: string
}

type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    cpf,
    idResponsibleByRequest,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const recipient = await this.recipientRepository.findByCpf(cpf)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
