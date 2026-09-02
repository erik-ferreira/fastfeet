import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"

import { Order as PrismaOrder, Prisma } from "@/generated/prisma/client"

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        title: raw.title,
        status: raw.status,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),

        recipientId: new UniqueEntityID(raw.recipientId),
        deliveryDriverId: raw.deliveryDriverId
          ? new UniqueEntityID(raw.deliveryDriverId)
          : null,

        attachmentId: raw.attachmentId
          ? new UniqueEntityID(raw.attachmentId)
          : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      title: order.title,
      status: order.status,
      latitude: order.latitude,
      longitude: order.longitude,

      recipientId: order.recipientId?.toString(),
      deliveryDriverId: order.deliveryDriverId?.toString(),
      attachmentId: order.attachmentId?.toString(),
    }
  }
}
