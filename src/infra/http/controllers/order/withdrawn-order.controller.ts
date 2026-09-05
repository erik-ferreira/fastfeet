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
} from "@nestjs/common"

import { WithdrawnOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/withdrawn-order"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

const withdrawnOrderSchema = z.object({
  deliveryDriverId: z.uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(withdrawnOrderSchema)

type WithdrawnOrderBodySchema = z.infer<typeof withdrawnOrderSchema>

@Controller("/orders/:orderId/withdrawn-order")
@UseGuards(AdminGuard)
export class WithdrawnOrderController {
  constructor(private withdrawnOrder: WithdrawnOrderUseCase) {}

  @Patch()
  @UsePipes()
  async handle(
    @Param("orderId") orderId: string,
    @Body(bodyValidationPipe) body: WithdrawnOrderBodySchema,
  ) {
    const { deliveryDriverId } = body

    const result = await this.withdrawnOrder.execute({
      orderId,
      deliveryDriverId,
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
