import { faker } from "@faker-js/faker"

import {
  Recipient,
  RecipientProps,
} from "@/domain/delivery-and-order/enterprise/entities/recipient"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

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
