import z from "zod"
import {
  Body,
  Post,
  UsePipes,
  Controller,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common"

import { AuthenticateUserUseCase } from "@/domain/delivery-and-order/application/use-cases/authenticate-user"

import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { WrongCredentialsError } from "@/domain/delivery-and-order/application/use-cases/errors/wrong-credentials-error"

const authenticateBodySchema = z.object({
  cpf: z.string().length(11, "Cpf incorreto"),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateUser.execute({ cpf, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
