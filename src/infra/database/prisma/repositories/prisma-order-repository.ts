import { Injectable } from "@nestjs/common"
import { Order as PrismaOrder } from "@/generated/prisma/client"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { NearbyParams } from "@/core/repositories/nearby-params"
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

  async save(order: Order): Promise<void> {
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

  async findManyNearby({
    latitude,
    longitude,
  }: NearbyParams): Promise<Order[]> {
    const rawOrders = await this.prisma.$queryRaw<PrismaOrder[]>`
    SELECT * FROM orders
    WHERE status IN ('PENDING', 'WAITING')
    AND (
      6371 * acos(
        cos(radians(${latitude})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(latitude))
      )
    ) < 10
  `

    return rawOrders.map(PrismaOrderMapper.toDomain)
  }
}
