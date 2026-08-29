import z from "zod"
import { Get, Controller, BadRequestException, Query } from "@nestjs/common"

import { FetchRecipientsUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-recipients"

import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

import { RecipientPresenter } from "@/infra/http/presenters/recipient-presenter"

const pageQueryParamSchema = z.coerce.number().int().min(1).default(1)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/recipient")
@Public()
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
