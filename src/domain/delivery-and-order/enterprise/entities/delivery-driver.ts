import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User, UserProps } from "./abstract/user"

export interface DeliveryDriverProps extends Omit<UserProps, "role"> {}

export class DeliveryDriver extends User {
  static create(props: DeliveryDriverProps, id?: UniqueEntityID) {
    const deliveryDriver = new DeliveryDriver(
      {
        ...props,
        role: "DELIVERY_DRIVER",
      },
      id,
    )

    return deliveryDriver
  }
}
