import {
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { DeleteOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-order"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

@Controller("/orders/:orderId")
@UseGuards(AdminGuard)
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("orderId") orderId: string) {
    const result = await this.deleteOrder.execute({
      id: orderId,
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
