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
  MethodNotAllowedException,
} from "@nestjs/common"

import { EditOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-order"

import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

const editOrderSchema = z.object({
  title: z.string().optional(),
  latitude: z
    .number("Latitude inválida")
    .min(-90, "Latitude deve ser maior ou igual a -90")
    .max(90, "Latitude deve ser menor ou igual a 90")
    .optional(),
  longitude: z
    .number("Longitude inválida")
    .min(-180, "Longitude deve ser maior ou igual a -180")
    .max(180, "Longitude deve ser menor ou igual a 180")
    .optional(),
  recipientId: z.uuid().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderSchema)

type EditOrderBodySchema = z.infer<typeof editOrderSchema>

@Controller("/orders/:orderId")
@Public()
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(201)
  @UsePipes()
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param("orderId") orderId: string,
  ) {
    const { title, latitude, longitude, recipientId } = body

    const result = await this.editOrder.execute({
      orderId,
      title,
      latitude,
      longitude,
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
