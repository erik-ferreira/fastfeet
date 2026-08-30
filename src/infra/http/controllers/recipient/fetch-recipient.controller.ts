import z from "zod"
import {
  Get,
  Query,
  UseGuards,
  Controller,
  BadRequestException,
} from "@nestjs/common"

import { FetchRecipientsUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-recipients"

import { AdminGuard } from "@/infra/auth/admin.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { RecipientPresenter } from "@/infra/http/presenters/recipient-presenter"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/recipients")
@UseGuards(AdminGuard)
export class FetchRecipientController {
  constructor(private fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  async handle(
    @Query("page", queryPageValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchRecipients.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const recipients = result.value.recipients

    return {
      recipients: recipients.map(RecipientPresenter.toHTTP),
    }
  }
}
