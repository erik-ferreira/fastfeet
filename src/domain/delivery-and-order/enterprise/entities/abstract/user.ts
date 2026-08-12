import z from "zod"

import { Entity } from "@/core/entities/entity"
import { Cpf } from "../value-objects/cpf"

export const userRoleSchema = z.enum(["ADMIN", "DELIVERY_DRIVER"])
export type UserRole = z.infer<typeof userRoleSchema>

export interface UserProps {
  cpf: Cpf
  name: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt?: Date | null
}

interface UserUpdateProps {
  name?: string
  cpf?: Cpf
}

export abstract class User<
  Props extends UserProps = UserProps,
> extends Entity<Props> {
  get name() {
    return this.props.name
  }

  set name(newName: string) {
    this.props.name = newName
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(newCpf: Cpf) {
    this.props.cpf = newCpf
    this.touch()
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  update({ name, cpf }: UserUpdateProps) {
    this.props.cpf = cpf ?? this.props.cpf
    this.props.name = name ?? this.props.name
    this.touch()
  }
}
