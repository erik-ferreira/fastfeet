import { DeliveryPerson } from "@/domain/delivery-and-order/enterprise/entities/delivery-person"
import { DeliveryPersonRepository } from "@/domain/delivery-and-order/application/repositories/delivery-person-repository"

export class InMemoryDeliveryPersonRepository extends DeliveryPersonRepository {
  public items: DeliveryPerson[] = []

  async findByCpf(cpf: string) {
    const deliveryPerson = this.items.find((item) => item.cpf === cpf)

    if (!deliveryPerson) {
      return null
    }

    return deliveryPerson
  }

  async findById(id: string) {
    const deliveryPerson = this.items.find((item) => item.id.toString() === id)

    if (!deliveryPerson) {
      return null
    }

    return deliveryPerson
  }

  async create(deliveryPerson: DeliveryPerson) {
    this.items.push(deliveryPerson)
  }

  update(deliveryPerson: DeliveryPerson): Promise<void> {
    throw new Error("Method not implemented.")
  }

  delete(id: string): Promise<DeliveryPerson | null> {
    throw new Error("Method not implemented.")
  }

  findMany(): Promise<DeliveryPerson[]> {
    throw new Error("Method not implemented.")
  }
}
