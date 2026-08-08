import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { User as PrismaUser, Prisma } from "@/generated/prisma/client"

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf.raw,
      password: admin.password,
      role: "ADMIN",
    }
  }
}
