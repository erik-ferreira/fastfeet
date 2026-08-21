import { faker } from "@faker-js/faker"

import {
  User,
  UserProps,
} from "@/domain/delivery-and-order/enterprise/entities/abstract/user"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { makeAdmin } from "./make-admin"
import { makeDeliveryDriver } from "./make-delivery-driver"

export function makeUser(
  { role = "ADMIN", ...override }: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  if (role === "DELIVERY_DRIVER") {
    return makeDeliveryDriver(override)
  }

  return makeAdmin(override)
}
