import z from "zod"
import {
  Body,
  Patch,
  Param,
  UsePipes,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
  MethodNotAllowedException,
} from "@nestjs/common"

import { DeliverOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/deliver-order"

import { DeliveryDriverGuard } from "@/infra/auth/delivery-driver.guard"

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

const deliverOrderSchema = z.object({
  deliveryDriverId: z.uuid(),
  attachmentId: z.uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(deliverOrderSchema)

type DeliverOrderBodySchema = z.infer<typeof deliverOrderSchema>

@Controller("/orders/:orderId/deliver")
@UseGuards(DeliveryDriverGuard)
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @UsePipes()
  async handle(
    @Param("orderId") orderId: string,
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
  ) {
    const { deliveryDriverId, attachmentId } = body

    const result = await this.deliverOrder.execute({
      orderId,
      deliveryDriverId,
      attachmentId,
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
