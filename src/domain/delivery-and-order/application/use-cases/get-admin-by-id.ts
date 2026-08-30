import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface GetAdminByIdUseCaseRequest {
  id: string
}

type GetAdminByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    admin: Admin
  }
>

@Injectable()
export class GetAdminByIdUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    id,
  }: GetAdminByIdUseCaseRequest): Promise<GetAdminByIdUseCaseResponse> {
    const admin = await this.adminRepository.findById(id)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    return right({ admin })
  }
}
