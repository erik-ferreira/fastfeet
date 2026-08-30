import {
  Get,
  Param,
  Controller,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common"

import { GetOrderDetailsUseCase } from "@/domain/delivery-and-order/application/use-cases/get-order-details"

import { Public } from "@/infra/auth/public"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { OrderPresenter } from "@/infra/http/presenters/order-presenter"

@Controller("/order/:orderId")
@Public()
export class GetOneOrderController {
  constructor(private getOrder: GetOrderDetailsUseCase) {}

  @Get()
  async handle(@Param("orderId") orderId: string) {
    const result = await this.getOrder.execute({
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

    const order = result.value.order

    return {
      order: OrderPresenter.toHTTP(order),
    }
  }
}
