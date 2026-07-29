import z from "zod"

import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export const userRoleSchema = z.enum(["ADMIN", "DELIVERY_DRIVER"])
export type UserRole = z.infer<typeof userRoleSchema>

export interface UserProps {
  cpf: string
  name: string
  password: string
  role: UserRole
}

export abstract class User<
  Props extends UserProps = UserProps,
> extends Entity<Props> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }
}
