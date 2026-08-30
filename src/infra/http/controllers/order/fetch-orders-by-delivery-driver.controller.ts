import z from "zod"
import { Get, Query, Controller, BadRequestException } from "@nestjs/common"

import { FetchOrdersDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-orders-delivery-driver"

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { OrderPresenter } from "@/infra/http/presenters/order-presenter"

import type { UserPayload } from "@/infra/auth/jwt.strategy"
import { CurrentUser } from "@/infra/auth/current-user-decorator"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/orders/me")
export class FetchOrderController {
  constructor(
    private fetchOrdersByDeliveryDriver: FetchOrdersDeliveryDriverUseCase,
  ) {}

  @Get()
  async handle(
    @Query("page", queryPageValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const deliveryDriverId = user.sub

    const result = await this.fetchOrdersByDeliveryDriver.execute({
      page,
      deliveryDriverId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}
