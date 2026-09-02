import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import {
  Recipient,
  RecipientProps,
} from "@/domain/delivery-and-order/enterprise/entities/recipient"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { PrismaRecipienteMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper"

type OmitRecipientProps = Omit<RecipientProps, "role">

export function makeRecipient(
  override: Partial<OmitRecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      cpf: Cpf.create(String(faker.string.numeric(11))),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: PrismaRecipienteMapper.toPrisma(recipient),
    })

    return recipient
  }
}
