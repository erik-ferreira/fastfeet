import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { PaginationParams } from "@/core/repositories/pagination-params"

import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

import { PrismaDeliveryDriverMapper } from "../mappers/prisma-delivery-driver-mapper"

@Injectable()
export class PrismaDeliveryDriverRepository implements DeliveryDriversRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryDriver: DeliveryDriver): Promise<void> {
    const data = PrismaDeliveryDriverMapper.toPrisma(deliveryDriver)

    await this.prisma.user.create({ data })
  }

  async save(deliveryDriver: DeliveryDriver): Promise<void> {
    const data = PrismaDeliveryDriverMapper.toPrisma(deliveryDriver)

    await this.prisma.user.update({
      where: { id: deliveryDriver.id.toString() },
      data,
    })
  }

  async delete(deliveryDriver: DeliveryDriver): Promise<void> {
    await this.prisma.user.delete({
      where: { id: deliveryDriver.id.toString() },
    })
  }

  async findById(id: string): Promise<DeliveryDriver | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      return null
    }

    return PrismaDeliveryDriverMapper.toDomain(user)
  }

  async findByCpf(cpf: string): Promise<DeliveryDriver | null> {
    const user = await this.prisma.user.findUnique({ where: { cpf } })

    if (!user) {
      return null
    }

    return PrismaDeliveryDriverMapper.toDomain(user)
  }

  async findMany({ page }: PaginationParams): Promise<DeliveryDriver[]> {
    const deliveryDrivers = await this.prisma.user.findMany({
      where: { role: "DELIVERY_DRIVER" },
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: (page - 1) * 20,
    })

    return deliveryDrivers.map(PrismaDeliveryDriverMapper.toDomain)
  }
}
