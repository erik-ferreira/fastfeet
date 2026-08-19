import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"

import { NearbyParams } from "@/core/repositories/nearby-params"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { getDistanceBetweenCoordinates } from "@/core/utils/get-distance-between-coordinates"

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findMany({ page }: PaginationParams): Promise<Order[]> {
    const orders = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    if (itemIndex >= 0) {
      this.items[itemIndex] = order
    }
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }

  async findManyNearby({
    page,
    latitude,
    longitude,
  }: NearbyParams): Promise<Order[]> {
    const orders = this.items
      .filter((order, index) => {
        const isAvailable =
          order.status === "PENDING" || order.status === "WAITING"

        if (!isAvailable) {
          return false
        }

        const distance = getDistanceBetweenCoordinates(
          { latitude: latitude, longitude: longitude },
          { latitude: order.latitude, longitude: order.longitude },
        )

        return distance < 10
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyByDeliveryDriver(
    deliveryDriverId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter(
        (order) =>
          order.deliveryDriverId &&
          order.deliveryDriverId.toString() === deliveryDriverId,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyFromSpecificRecipient(
    recipientId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter(
        (order) =>
          order.recipientId && order.recipientId.toString() === recipientId,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }
}
