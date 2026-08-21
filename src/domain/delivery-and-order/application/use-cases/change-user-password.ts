import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { HashGenerator } from "@/domain/delivery-and-order/application/cryptography/hash-generator"
import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface ChangeUserPasswordUserUseCaseRequest {
  userId: string
  newPassword: string
}

type ChangeUserPasswordUserUseCaseResponse = Either<
  ResourceNotFoundError,
  { message: string }
>

@Injectable()
export class ChangeUserPasswordUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    newPassword,
  }: ChangeUserPasswordUserUseCaseRequest): Promise<ChangeUserPasswordUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const newPasswordHash = await this.hashGenerator.hash(newPassword)

    user.changePassword(newPasswordHash)

    await this.userRepository.save(user)

    return right({ message: "Senha alterada com sucesso!" })
  }
}
