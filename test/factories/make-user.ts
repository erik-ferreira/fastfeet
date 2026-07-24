import { faker } from "@faker-js/faker"

import {
  User,
  UserProps,
} from "@/domain/delivery-and-order/enterprise/entities/user"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}
