import z from "zod"
import {
  Put,
  Body,
  Param,
  HttpCode,
  UsePipes,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"

import { EditAdminUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-admin"

import { AdminGuard } from "@/infra/auth/admin.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

const editAdminSchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editAdminSchema)

type EditAdminBodySchema = z.infer<typeof editAdminSchema>

@Controller("/admins/:adminId")
@UseGuards(AdminGuard)
export class EditAdminController {
  constructor(private editAdmin: EditAdminUseCase) {}

  @Put()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Body(bodyValidationPipe) body: EditAdminBodySchema,
    @Param("adminId") adminId: string,
  ) {
    const { name, cpf } = body

    const result = await this.editAdmin.execute({
      adminId,
      name,
      cpf,
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
