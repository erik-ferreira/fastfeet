import {
  Get,
  Param,
  Controller,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common"

import { GetDeliveryDriverByCpfUseCase } from "@/domain/delivery-and-order/application/use-cases/get-delivery-driver-by-cpf"

import { Public } from "@/infra/auth/public"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { DeliveryDriverPresenter } from "@/infra/http/presenters/delivery-driver-presenter"

@Controller("/delivery-drivers/:deliveryDriverCpf")
@Public()
export class GetOneDeliveryDriverController {
  constructor(private getOneDeliveryDrivers: GetDeliveryDriverByCpfUseCase) {}

  @Get()
  async handle(@Param("deliveryDriverCpf") deliveryDriverCpf: string) {
    const result = await this.getOneDeliveryDrivers.execute({
      cpf: deliveryDriverCpf,
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

    const deliveryDriver = result.value.deliveryDriver

    return {
      deliveryDriver: DeliveryDriverPresenter.toHTTP(deliveryDriver),
    }
  }
}
