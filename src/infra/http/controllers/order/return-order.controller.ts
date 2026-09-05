import {
  Patch,
  Param,
  UsePipes,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { ReturnOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/return-order"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

@Controller("/orders/:orderId/return-order")
@UseGuards(AdminGuard)
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch()
  @UsePipes()
  async handle(@Param("orderId") orderId: string) {
    const result = await this.returnOrder.execute({
      orderId,
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
