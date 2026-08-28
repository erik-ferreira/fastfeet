import {
  Param,
  Delete,
  HttpCode,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { DeleteDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-delivery-driver"

import { Public } from "@/infra/auth/public"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

@Controller("/delivery-driver/:deliveryDriverId")
@Public()
export class DeleteDeliveryDriverController {
  constructor(private deleteDeliveryDriver: DeleteDeliveryDriverUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("deliveryDriverId") deliveryDriverId: string) {
    const result = await this.deleteDeliveryDriver.execute({
      id: deliveryDriverId,
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
