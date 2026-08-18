import {
  Prisma,
  Attachment as PrismaAttachment,
} from "@/generated/prisma/client"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { OrderAttachment } from "@/domain/delivery-and-order/enterprise/entities/order-attachment"

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error("Invalid attachment")
    }

    return OrderAttachment.create(
      {
        orderId: new UniqueEntityID(raw.orderId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: OrderAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        orderId: attachments[0].orderId.toString(),
      },
    }
  }
}
