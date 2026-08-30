import {
  Get,
  Param,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { GetAdminByIdUseCase } from "@/domain/delivery-and-order/application/use-cases/get-admin-by-id"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

import { AdminPresenter } from "@/infra/http/presenters/admin-presenter"

@Controller("/admins/:id")
@UseGuards(AdminGuard)
export class GetOneAdminController {
  constructor(private getOneAdmin: GetAdminByIdUseCase) {}

  @Get()
  async handle(@Param("id") id: string) {
    const result = await this.getOneAdmin.execute({ id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const admin = result.value.admin

    return {
      admin: AdminPresenter.toHTTP(admin),
    }
  }
}
