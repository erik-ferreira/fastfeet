import { Injectable } from "@nestjs/common"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  OrderAttachment,
  OrderAttachmentProps,
} from "@/domain/delivery-and-order/enterprise/entities/order-attachment"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeOrderAttachment(
  override: Partial<OrderAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const question = OrderAttachment.create(
    {
      orderId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class OrderAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrderAttachment(
    data: Partial<OrderAttachmentProps> = {},
  ): Promise<OrderAttachment> {
    const orderAttachment = makeOrderAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: orderAttachment.attachmentId.toString(),
      },
      data: {
        orderId: orderAttachment.orderId.toString(),
      },
    })

    return orderAttachment
  }
}
