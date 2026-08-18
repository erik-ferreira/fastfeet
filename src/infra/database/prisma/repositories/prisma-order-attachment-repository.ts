import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { PrismaOrderAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-order-attachment-mapper"

import { OrderAttachment } from "@/domain/delivery-and-order/enterprise/entities/order-attachment"
import { OrderAttachmentRepository } from "@/domain/delivery-and-order/application/repositories/order-attachment-repository"

@Injectable()
export class PrismaOrderAttachmentRepository implements OrderAttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: OrderAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaOrderAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: OrderAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async findManyByOrderId(orderId: string): Promise<OrderAttachment[]> {
    const ordersAttachments = await this.prisma.attachment.findMany({
      where: { orderId },
    })

    return ordersAttachments.map(PrismaOrderAttachmentMapper.toDomain)
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { orderId },
    })
  }
}
