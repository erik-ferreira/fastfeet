import { Optional } from "@/core/types/optional"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { User, UserProps } from "./abstract/user"

export interface AdminProps extends Omit<UserProps, "role"> {}

export type AdminCreatedProps = Optional<AdminProps, "createdAt" | "updatedAt">

export class Admin extends User<UserProps> {
  private readonly _brand = "Admin" as const

  static create(props: AdminCreatedProps, id?: UniqueEntityID) {
    const admin = new Admin(
      {
        ...props,
        role: "ADMIN",
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )

    return admin
  }
}
