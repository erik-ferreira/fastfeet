import { faker } from "@faker-js/faker"

import {
  Admin,
  AdminProps,
} from "@/domain/delivery-and-order/enterprise/entities/admin"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

type OmitAdminProps = Omit<AdminProps, "role">

export function makeAdmin(
  override: Partial<OmitAdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: Cpf.create(String(faker.string.numeric(11))),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}
