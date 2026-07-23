import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"
import { PaginationParams } from "@/core/repositories/pagination-params"

export class InMemoryDeliveryDriverRepository implements DeliveryDriversRepository {
  public items: DeliveryDriver[] = []

  async findByCpf(cpf: string) {
    const deliveryDriver = this.items.find((item) => item.cpf === cpf)

    if (!deliveryDriver) {
      return null
    }

    return deliveryDriver
  }

  async findById(id: string) {
    const deliveryDriver = this.items.find((item) => item.id.toString() === id)

    if (!deliveryDriver) {
      return null
    }

    return deliveryDriver
  }

  async create(deliveryDriver: DeliveryDriver) {
    this.items.push(deliveryDriver)
  }

  async update(deliveryDriver: DeliveryDriver) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryDriver.id,
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = deliveryDriver
    }
  }

  async delete(deliveryDriver: DeliveryDriver) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryDriver.id,
    )

    this.items.splice(itemIndex, -1)
  }

  async findMany({ page }: PaginationParams) {
    const deliveryDrivers = this.items
      // .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return deliveryDrivers
  }
}
