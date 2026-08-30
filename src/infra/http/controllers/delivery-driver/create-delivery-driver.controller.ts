import z from "zod"
import {
  Body,
  Post,
  HttpCode,
  UsePipes,
  UseGuards,
  Controller,
  BadRequestException,
  ConflictException,
} from "@nestjs/common"

import { CreateDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/create-delivery-driver"

import { AdminGuard } from "@/infra/auth/admin.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { AlreadyExistsError } from "@/domain/delivery-and-order/application/use-cases/errors/already-exists-error"

const createDeliveryDriverSchema = z.object({
  name: z.string().min(1, "Informe o nome do entregador"),
  cpf: z
    .string()
    .min(1, "Informe o cpf do entregador")
    .length(11, "CPF inválido"),
  password: z.string().min(6),
})

type CreateDeliveryDriverBodySchema = z.infer<typeof createDeliveryDriverSchema>

@Controller("/delivery-drivers")
@UseGuards(AdminGuard)
export class CreateDeliveryDriverController {
  constructor(private createDeliveryDriver: CreateDeliveryDriverUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliveryDriverSchema))
  async handle(@Body() body: CreateDeliveryDriverBodySchema) {
    const { name, cpf, password } = body

    const result = await this.createDeliveryDriver.execute({
      name,
      cpf,
      password,
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
