import {
  Patch,
  Param,
  UsePipes,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { MarkOrderAsWaitingUseCase } from "@/domain/delivery-and-order/application/use-cases/mark-order-as-waiting"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

@Controller("/orders/:orderId/mark-order-as-waiting")
export class MarkOrderAsWaitingController {
  constructor(private markOrderAsWaiting: MarkOrderAsWaitingUseCase) {}

  @Patch()
  @UsePipes()
  async handle(@Param("orderId") orderId: string) {
    const result = await this.markOrderAsWaiting.execute({
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
