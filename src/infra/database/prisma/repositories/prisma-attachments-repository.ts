import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper"

import { Attachment } from "@/domain/delivery-and-order/enterprise/entities/attachment"
import { AttachmentRepository } from "@/domain/delivery-and-order/application/repositories/attachment-repository"

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({ data })
  }
}
