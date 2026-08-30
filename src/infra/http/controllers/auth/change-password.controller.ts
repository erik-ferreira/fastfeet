import z from "zod"
import {
  Body,
  Post,
  Param,
  UsePipes,
  UseGuards,
  Controller,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common"

import { ChangeUserPasswordUserUseCase } from "@/domain/delivery-and-order/application/use-cases/change-user-password"

import { AdminGuard } from "@/infra/auth/admin.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

const changePasswordBodySchema = z.object({
  newPassword: z.string().min(6),
})

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller("/sessions/change-password/:userId")
@UseGuards(AdminGuard)
export class ChangePasswordController {
  constructor(private changeUserPassword: ChangeUserPasswordUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(changePasswordBodySchema))
  async handle(
    @Body() body: ChangePasswordBodySchema,
    @Param("userId") userId: string,
  ) {
    const { newPassword } = body

    const result = await this.changeUserPassword.execute({
      newPassword,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { message } = result.value

    return { message }
  }
}
