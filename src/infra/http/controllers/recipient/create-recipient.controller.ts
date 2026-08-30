import z from "zod"
import {
  Body,
  Post,
  HttpCode,
  UsePipes,
  UseGuards,
  Controller,
  ConflictException,
  BadRequestException,
} from "@nestjs/common"

import { CreateRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/create-recipient"

import { AdminGuard } from "@/infra/auth/admin.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

const createRecipientSchema = z.object({
  name: z.string().min(1, "Informe o nome do entregador"),
  cpf: z
    .string()
    .min(1, "Informe o cpf do entregador")
    .length(11, "CPF inválido"),
  latitude: z.coerce
    .number("Latitude inválida")
    .min(-90, "Latitude deve ser maior ou igual a -90")
    .max(90, "Latitude deve ser menor ou igual a 90"),
  longitude: z.coerce
    .number("Longitude inválida")
    .min(-180, "Longitude deve ser maior ou igual a -180")
    .max(180, "Longitude deve ser menor ou igual a 180"),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientSchema>

@Controller("/recipients")
@UseGuards(AdminGuard)
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientSchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { name, cpf, latitude, longitude } = body

    const result = await this.createRecipient.execute({
      name,
      cpf,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
