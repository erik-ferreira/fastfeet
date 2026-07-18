import { DeliveryPerson } from "@/domain/delivery-and-order/enterprise/entities/delivery-person"

export abstract class DeliveryPersonRepository {
  abstract create(deliveryPerson: DeliveryPerson): Promise<void>
  abstract update(deliveryPerson: DeliveryPerson): Promise<void>
  abstract delete(id: string): Promise<DeliveryPerson | null>
  abstract findById(id: string): Promise<DeliveryPerson | null>
  abstract findByCpf(cpf: string): Promise<DeliveryPerson | null>
  abstract findMany(): Promise<DeliveryPerson[]>
}
