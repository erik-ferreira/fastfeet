import z from "zod"
import {
  Get,
  Query,
  UseGuards,
  Controller,
  BadRequestException,
} from "@nestjs/common"

import { FetchOrdersUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-orders"

import { AdminGuard } from "@/infra/auth/admin.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { OrderPresenter } from "@/infra/http/presenters/order-presenter"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/orders")
@UseGuards(AdminGuard)
export class FetchOrderController {
  constructor(private fetchOrders: FetchOrdersUseCase) {}

  @Get()
  async handle(
    @Query("page", queryPageValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchOrders.execute({
      page,
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
