import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"

import { Encrypter } from "@/domain/delivery-and-order/application/cryptography/encrypter"
import { HashComparer } from "@/domain/delivery-and-order/application/cryptography/hash-comparer"
import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"

import { WrongCredentialsError } from "./errors/wrong-credentials-error"

interface AuthenticateUserUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByCpf(cpf)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const passwordsMatched = await this.hashComparer.compare(
      password,
      user.password,
    )

    console.log("passwords", {
      password,
      passwordTwo: user.password,
    })

    if (!passwordsMatched) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({ accessToken })
  }
}
