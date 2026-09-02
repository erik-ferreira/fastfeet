import z from "zod"
import {
  Put,
  Body,
  Param,
  HttpCode,
  UsePipes,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { EditRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-recipient"

import { AdminGuard } from "@/infra/auth/admin.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

const editRecipientSchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientSchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientSchema>

@Controller("/recipients/:recipientId")
@UseGuards(AdminGuard)
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param("recipientId") recipientId: string,
  ) {
    const { name, cpf, latitude, longitude } = body

    const result = await this.editRecipient.execute({
      recipientId,
      name,
      cpf,
      latitude,
      longitude,
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
