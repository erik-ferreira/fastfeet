import { faker } from "@faker-js/faker"

import {
  Order,
  OrderProps,
} from "@/domain/delivery-and-order/enterprise/entities/order"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Order.create(
    {
      title: faker.lorem.sentence(),
      status: override.status ?? "PENDING",
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      recipientId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  )

  return recipient
}
