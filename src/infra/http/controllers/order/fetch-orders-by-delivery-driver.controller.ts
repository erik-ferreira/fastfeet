import z from "zod"
import {
  Get,
  Param,
  Controller,
  BadRequestException,
  Query,
} from "@nestjs/common"

import { FetchOrdersDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-orders-delivery-driver"

import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { OrderPresenter } from "@/infra/http/presenters/order-presenter"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/order/delivery-drivers/:deliveryDriverId")
@Public()
export class FetchOrderController {
  constructor(
    private fetchOrdersByDeliveryDriver: FetchOrdersDeliveryDriverUseCase,
  ) {}

  @Get()
  async handle(
    @Query("page", queryPageValidationPipe) page: PageQueryParamSchema,
    @Param("deliveryDriverId") deliveryDriverId: string,
  ) {
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
