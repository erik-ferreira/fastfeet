import { PaginationParams } from "@/core/repositories/pagination-params"
import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

export abstract class DeliveryDriversRepository {
  abstract create(deliveryDriver: DeliveryDriver): Promise<void>
  abstract update(deliveryDriver: DeliveryDriver): Promise<void>
  abstract delete(deliveryDriver: DeliveryDriver): Promise<void>
  abstract findById(id: string): Promise<DeliveryDriver | null>
  abstract findByCpf(cpf: string): Promise<DeliveryDriver | null>
  abstract findMany(params: PaginationParams): Promise<DeliveryDriver[]>
}
