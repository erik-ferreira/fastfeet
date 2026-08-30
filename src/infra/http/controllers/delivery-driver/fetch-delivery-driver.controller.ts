import z from "zod"
import {
  Get,
  Query,
  UseGuards,
  Controller,
  BadRequestException,
} from "@nestjs/common"

import { FetchDeliveryDriversUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-delivery-drivers"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { DeliveryDriverPresenter } from "@/infra/http/presenters/delivery-driver-presenter"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/delivery-drivers")
@UseGuards(AdminGuard)
export class FetchDeliveryDriverController {
  constructor(private fetchDeliveryDrivers: FetchDeliveryDriversUseCase) {}

  @Get()
  async handle(
    @Query("page", queryPageValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchDeliveryDrivers.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const deliveryDrivers = result.value.deliveryDrivers

    return {
      deliveryDrivers: deliveryDrivers.map(DeliveryDriverPresenter.toHTTP),
    }
  }
}
