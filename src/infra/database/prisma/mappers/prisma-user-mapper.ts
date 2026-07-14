import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User } from "@/domain/delivery-and-order/enterprise/entities/user"

import { User as PrismaUser, Prisma } from "@/generated/prisma/client"

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf,
      password: user.password,
    }
  }
}
