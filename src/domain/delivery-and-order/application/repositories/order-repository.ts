import { NearbyParams } from "@/core/repositories/nearby-params"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(params: PaginationParams): Promise<Order[]>
  abstract findManyNearby(params: NearbyParams): Promise<Order[]>
  abstract findManyByDeliveryDriver(
    deliveryDriverId: string,
    params: PaginationParams,
  ): Promise<Order[]>
  abstract findManyFromSpecificRecipient(
    recipientId: string,
    params: PaginationParams,
  ): Promise<Order[]>
}
