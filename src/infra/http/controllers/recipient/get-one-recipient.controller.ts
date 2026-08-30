import {
  Get,
  Param,
  UseGuards,
  Controller,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common"

import { GetRecipientByCpfUseCase } from "@/domain/delivery-and-order/application/use-cases/get-recipient-by-cpf"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { RecipientPresenter } from "@/infra/http/presenters/recipient-presenter"

@Controller("/recipients/:recipientCpf")
@UseGuards(AdminGuard)
export class GetOneRecipientController {
  constructor(private getOneRecipient: GetRecipientByCpfUseCase) {}

  @Get()
  async handle(@Param("recipientCpf") recipientCpf: string) {
    const result = await this.getOneRecipient.execute({
      cpf: recipientCpf,
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

    const recipient = result.value.recipient

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    }
  }
}
