import { faker } from "@faker-js/faker"

import {
  DeliveryDriver,
  DeliveryDriverProps,
} from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

type OmitDeliveryDriverProps = Omit<DeliveryDriverProps, "role">

export function makeDeliveryDriver(
  override: Partial<OmitDeliveryDriverProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryDriver = DeliveryDriver.create(
    {
      name: faker.person.fullName(),
      cpf: Cpf.create(String(faker.string.numeric(11))),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryDriver
}
