import z from "zod"
import { Get, Query, Controller, BadRequestException } from "@nestjs/common"

import { FetchNearbyOrdersTheDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-nearby-orders-the-delivery-driver"

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { OrderPresenter } from "@/infra/http/presenters/order-presenter"

const fetchNearbyOrdersQueryParamSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  latitude: z.coerce
    .number("Latitude inválida")
    .min(-90, "Latitude deve ser maior ou igual a -90")
    .max(90, "Latitude deve ser menor ou igual a 90"),
  longitude: z.coerce
    .number("Longitude inválida")
    .min(-180, "Longitude deve ser maior ou igual a -180")
    .max(180, "Longitude deve ser menor ou igual a 180"),
})

type FetchNearbyOrdersQueryParamSchema = z.infer<
  typeof fetchNearbyOrdersQueryParamSchema
>

@Controller("/orders/nearby")
export class FetchOrderController {
  constructor(
    private fetchNearbyOrdersTheDeliveryDriver: FetchNearbyOrdersTheDeliveryDriverUseCase,
  ) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(fetchNearbyOrdersQueryParamSchema))
    query: FetchNearbyOrdersQueryParamSchema,
  ) {
    const { page, latitude, longitude } = query

    const result = await this.fetchNearbyOrdersTheDeliveryDriver.execute({
      page,
      user: { latitude, longitude },
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
