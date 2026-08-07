import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { Optional } from "@/core/types/optional"

import { Cpf } from "./value-objects/cpf"

export interface RecipientProps {
  name: string
  cpf: Cpf
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt?: Date | null
}

export type RecipientCreateProps = Optional<
  RecipientProps,
  "createdAt" | "updatedAt"
>

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(newCpf: Cpf) {
    this.props.cpf = newCpf
    this.touch()
  }

  get latitude() {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
    this.touch()
  }

  get longitude() {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
    this.touch()
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

  static create(props: RecipientCreateProps, id?: UniqueEntityID) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )

    return recipient
  }
}
