import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface GetRecipientByCpfUseCaseRequest {
  cpf: string
  idResponsibleByRequest: string
}

type GetRecipientByCpfUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientByCpfUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    cpf,
    idResponsibleByRequest,
  }: GetRecipientByCpfUseCaseRequest): Promise<GetRecipientByCpfUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const recipient = await this.recipientRepository.findByCpf(cpf)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({ recipient })
  }
}
