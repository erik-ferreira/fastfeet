import z from "zod"
import {
  Body,
  Post,
  UsePipes,
  HttpCode,
  Controller,
  BadRequestException,
} from "@nestjs/common"

import { CreateOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/create-order"

import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"

const createOrderSchema = z.object({
  title: z.string().min(1, "Informe o título do pedido"),
  status: z.enum(["PENDING", "WAITING", "WITHDRAWN", "DELIVERED", "RETURNED"]),
  latitude: z
    .number("Latitude inválida")
    .min(-90, "Latitude deve ser maior ou igual a -90")
    .max(90, "Latitude deve ser menor ou igual a 90"),
  longitude: z
    .number("Longitude inválida")
    .min(-180, "Longitude deve ser maior ou igual a -180")
    .max(180, "Longitude deve ser menor ou igual a 180"),
  recipientId: z.uuid({ error: "Informe o destinatário" }),
  deliveryDriverId: z.uuid().optional(),
  attachmentId: z.uuid().optional(),
})

type CreateOrderBodySchema = z.infer<typeof createOrderSchema>

@Controller("/orders")
@Public()
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async handle(@Body() body: CreateOrderBodySchema) {
    const {
      title,
      status,
      latitude,
      longitude,
      recipientId,
      deliveryDriverId,
      attachmentId,
    } = body

    const result = await this.createOrder.execute({
      title,
      status,
      latitude,
      longitude,
      recipientId,
      deliveryDriverId,
      attachmentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
