import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { UnauthorizedError } from "@/core/errors/unauthorized-error"

interface FetchRecipientsUseCaseRequest {
  page: number
  idResponsibleByRequest: string
}

type FetchRecipientsUseCaseResponse = Either<
  UnauthorizedError,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class FetchRecipientsUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    page,
    idResponsibleByRequest,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const admin = await this.adminRepository.findById(idResponsibleByRequest)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const recipients = await this.recipientRepository.findMany({
      page,
    })

    return right({ recipients })
  }
}
