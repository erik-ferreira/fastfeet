import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"
import { AlreadyExistsError } from "./errors/already-exists-error"

interface EditAdminUseCaseRequest {
  adminId: string
  name?: string
  cpf?: string
}

type EditAdminUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    admin: Admin
  }
>

@Injectable()
export class EditAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    adminId,
    name,
    cpf,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    if (cpf) {
      const adminWithSameCpf = await this.adminRepository.findByCpf(cpf)

      const isCpfBelongsToAnotherAdmin =
        adminWithSameCpf && !adminWithSameCpf.id.equals(admin.id)

      if (isCpfBelongsToAnotherAdmin) {
        return left(new AlreadyExistsError("Admin", cpf))
      }
    }

    admin.update({
      name,
      cpf: cpf ? Cpf.create(cpf) : undefined,
    })

    await this.adminRepository.save(admin)

    return right({ admin })
  }
}
