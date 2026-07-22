import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface DeliveryDriverProps {
  cpf: string
  name: string
  password: string
}

export class DeliveryDriver extends Entity<DeliveryDriverProps> {
  get name() {
    return this.props.name
  }

  set name(newName: string) {
    this.props.name = newName
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(newCpf: string) {
    this.props.cpf = newCpf
  }

  get password() {
    return this.props.password
  }

  static create(props: DeliveryDriverProps, id?: UniqueEntityID) {
    const deliveryDriver = new DeliveryDriver(props, id)

    return deliveryDriver
  }
}
