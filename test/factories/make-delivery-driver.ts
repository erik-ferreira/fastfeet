import { faker } from "@faker-js/faker"

import {
  DeliveryDriver,
  DeliveryDriverProps,
} from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

type OmitDeliveryDriverProps = Omit<DeliveryDriverProps, "role">

export function makeDeliveryDriver(
  override: Partial<OmitDeliveryDriverProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryDriver = DeliveryDriver.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      ...override,
      role: "delivery_driver",
    },
    id,
  )

  return deliveryDriver
}
