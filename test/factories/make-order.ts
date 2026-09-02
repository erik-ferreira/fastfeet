import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import {
  Order,
  OrderProps,
} from "@/domain/delivery-and-order/enterprise/entities/order"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { PrismaOrderMapper } from "@/infra/database/prisma/mappers/prisma-order-mapper"

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Order.create(
    {
      title: faker.lorem.sentence(),
      status: override.status ?? "PENDING",
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      recipientId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}
