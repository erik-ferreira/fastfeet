import { Optional } from "@/core/types/optional"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { User, UserProps } from "./abstract/user"

export interface DeliveryDriverProps extends Omit<UserProps, "role"> {}

export type DeliveryDriverCreatedProps = Optional<
  DeliveryDriverProps,
  "createdAt" | "updatedAt"
>

export class DeliveryDriver extends User {
  private readonly _brand = "DeliveryDriver" as const

  static create(props: DeliveryDriverCreatedProps, id?: UniqueEntityID) {
    const deliveryDriver = new DeliveryDriver(
      {
        ...props,
        role: "DELIVERY_DRIVER",
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )

    return deliveryDriver
  }
}
