import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { PaginationParams } from "@/core/repositories/pagination-params"

import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"

import { PrismaOrderMapper } from "../mappers/prisma-order-mapper"

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({ data })
  }

  async update(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: { id: order.id.toString() },
      data,
    })
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: { id: order.id.toString() },
    })
  }

  async findById(id: string): Promise<Order | null> {
    const user = await this.prisma.order.findUnique({ where: { id } })

    if (!user) {
      return null
    }

    return PrismaOrderMapper.toDomain(user)
  }

  async findMany({ page }: PaginationParams): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }
}
