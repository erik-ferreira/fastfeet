import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { HashGenerator } from "../cryptography/hash-generator"
import { AlreadyExistsError } from "./errors/already-exists-error"

interface CreateAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateAdminUseCaseResponse = Either<
  AlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: CreateAdminUseCaseRequest): Promise<CreateAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return left(new AlreadyExistsError("User", cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      cpf: Cpf.create(cpf),
      name,
      password: hashedPassword,
    })

    await this.adminRepository.create(admin)

    return right({ admin })
  }
}
