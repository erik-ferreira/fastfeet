import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { User as PrismaUser, Prisma } from "@/generated/prisma/client"

export class PrismaDeliveryDriverMapper {
  static toDomain(raw: PrismaUser): DeliveryDriver {
    return DeliveryDriver.create(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    deliveryDriver: DeliveryDriver,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryDriver.id.toString(),
      name: deliveryDriver.name,
      cpf: deliveryDriver.cpf.raw,
      password: deliveryDriver.password,
      role: "DELIVERY_DRIVER",
    }
  }
}
