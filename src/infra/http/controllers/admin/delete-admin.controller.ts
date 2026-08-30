import {
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { DeleteAdminUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-admin"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

@Controller("/admins/:id")
@UseGuards(AdminGuard)
export class DeleteAdminController {
  constructor(private deleteAdmin: DeleteAdminUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const result = await this.deleteAdmin.execute({ id })

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
