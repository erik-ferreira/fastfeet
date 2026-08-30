import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

interface FetchAdminsUseCaseRequest {
  page: number
}

type FetchAdminsUseCaseResponse = Either<
  null,
  {
    admins: Admin[]
  }
>

@Injectable()
export class FetchAdminsUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    page,
  }: FetchAdminsUseCaseRequest): Promise<FetchAdminsUseCaseResponse> {
    const admins = await this.adminRepository.findMany({
      page,
    })

    return right({ admins })
  }
}
