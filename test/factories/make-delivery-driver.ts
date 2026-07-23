import { faker } from "@faker-js/faker"

import {
  DeliveryDriver,
  DeliveryDriverProps,
} from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export function makeDeliveryDriver(
  override: Partial<DeliveryDriverProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryDriver = DeliveryDriver.create(
    {
      name: faker.person.fullName(),
      cpf: faker.helpers.fromRegExp("###########"),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryDriver
}
