import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { Recipient as PrismaRecipient, Prisma } from "@/generated/prisma/client"

export class PrismaRecipienteMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        latitude: raw.latitude,
        longitude: raw.longitude,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.raw,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    }
  }
}
