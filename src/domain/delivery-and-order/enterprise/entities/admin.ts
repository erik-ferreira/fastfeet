import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User, UserProps } from "./abstract/user"

export interface AdminProps extends Omit<UserProps, "role"> {}

export class Admin extends User<UserProps> {
  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(
      {
        ...props,
        role: "ADMIN",
      },
      id,
    )

    return admin
  }
}
