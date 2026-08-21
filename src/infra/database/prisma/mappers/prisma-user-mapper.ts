import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User } from "@/domain/delivery-and-order/enterprise/entities/abstract/user"
import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { User as PrismaUser, Prisma } from "@/generated/prisma/client"

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    const id = new UniqueEntityID(raw.id)

    if (raw.role === "ADMIN") {
      return Admin.create(
        {
          name: raw.name,
          cpf: Cpf.create(raw.cpf),
          password: raw.password,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        },
        id,
      )
    }

    return DeliveryDriver.create(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      id,
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf.raw,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
