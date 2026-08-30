import z from "zod"
import {
  Get,
  Param,
  Controller,
  BadRequestException,
  Query,
} from "@nestjs/common"

import { FetchOrdersFromSpecificRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-orders-from-specific-recipient"

import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { OrderPresenter } from "@/infra/http/presenters/order-presenter"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/order/recipients/:recipientId")
@Public()
export class FetchOrderController {
  constructor(
    private fetchOrdersFromSpecificRecipient: FetchOrdersFromSpecificRecipientUseCase,
  ) {}

  @Get()
  async handle(
    @Query("page", queryPageValidationPipe) page: PageQueryParamSchema,
    @Param("recipientId") recipientId: string,
  ) {
    const result = await this.fetchOrdersFromSpecificRecipient.execute({
      page,
      recipientId,
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
