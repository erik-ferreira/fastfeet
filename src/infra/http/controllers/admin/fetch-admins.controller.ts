import z from "zod"
import {
  Get,
  Query,
  UseGuards,
  Controller,
  BadRequestException,
} from "@nestjs/common"

import { FetchAdminsUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-admins"

import { AdminGuard } from "@/infra/auth/admin.guard"

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { AdminPresenter } from "@/infra/http/presenters/admin-presenter"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/admins")
@UseGuards(AdminGuard)
export class FetchAdminController {
  constructor(private fetchAdmins: FetchAdminsUseCase) {}

  @Get()
  async handle(
    @Query("page", queryPageValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchAdmins.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const admins = result.value.admins

    return {
      admins: admins.map(AdminPresenter.toHTTP),
    }
  }
}
