import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { User } from "@/domain/delivery-and-order/enterprise/entities/user"
import { HashGenerator } from "@/domain/delivery-and-order/application/cryptography/hash-generator"
import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"

import { OperatorAlreadyExistsError } from "./errors/operator-already-exists-error"

interface RegisterUserUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterUserUseCaseResponse = Either<
  OperatorAlreadyExistsError,
  { user: User }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameCpf = await this.userRepository.findByCpf(cpf)

    if (userWithSameCpf) {
      return left(new OperatorAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.userRepository.create(user)

    return right({ user })
  }
}
