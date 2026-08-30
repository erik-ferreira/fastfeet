import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

interface DeleteAdminUseCaseRequest {
  id: string
}

type DeleteAdminUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    id,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminRepository.findById(id)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    await this.adminRepository.delete(admin)

    return right(null)
  }
}
