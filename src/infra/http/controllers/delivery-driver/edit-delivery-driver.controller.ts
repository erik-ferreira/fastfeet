import z from "zod"
import {
  Put,
  Body,
  Param,
  HttpCode,
  UsePipes,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { EditDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-delivery-driver"

import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

const editDeliveryDriverSchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliveryDriverSchema)

type EditDeliveryDriverBodySchema = z.infer<typeof editDeliveryDriverSchema>

@Controller("/delivery-driver/:deliveryDriverId")
@Public()
export class EditDeliveryDriverController {
  constructor(private editDeliveryDriver: EditDeliveryDriverUseCase) {}

  @Put()
  @HttpCode(201)
  @UsePipes()
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryDriverBodySchema,
    @Param("deliveryDriverId") deliveryDriverId: string,
  ) {
    const { name, cpf } = body

    const result = await this.editDeliveryDriver.execute({
      deliveryDriverId,
      name,
      cpf,
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
