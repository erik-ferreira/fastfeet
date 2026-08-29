import {
  Param,
  Delete,
  HttpCode,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { DeleteRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-recipient"

import { Public } from "@/infra/auth/public"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

@Controller("/recipient/:recipientId")
@Public()
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("recipientId") recipientId: string) {
    const result = await this.deleteRecipient.execute({
      id: recipientId,
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
  }
}
