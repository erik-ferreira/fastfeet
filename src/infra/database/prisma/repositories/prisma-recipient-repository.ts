import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"

import { PaginationParams } from "@/core/repositories/pagination-params"

import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"

import { PrismaRecipienteMapper } from "../mappers/prisma-recipient-mapper"

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipienteMapper.toPrisma(recipient)

    await this.prisma.recipient.create({ data })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipienteMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: { id: recipient.id.toString() },
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.delete({
      where: { id: recipient.id.toString() },
    })
  }

  async findById(id: string): Promise<Recipient | null> {
    const user = await this.prisma.recipient.findUnique({ where: { id } })

    if (!user) {
      return null
    }

    return PrismaRecipienteMapper.toDomain(user)
  }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const user = await this.prisma.recipient.findUnique({ where: { cpf } })

    if (!user) {
      return null
    }

    return PrismaRecipienteMapper.toDomain(user)
  }

  async findMany({ page }: PaginationParams): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: (page - 1) * 20,
    })

    return recipients.map(PrismaRecipienteMapper.toDomain)
  }
}
