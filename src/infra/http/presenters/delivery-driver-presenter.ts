import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

export class DeliveryDriverPresenter {
  static toHTTP(deliveryDriver: DeliveryDriver) {
    return {
      id: deliveryDriver.id.toString(),
      name: deliveryDriver.name,
      cpf: deliveryDriver.cpf.raw,
      createdAt: deliveryDriver.createdAt,
      updatedAt: deliveryDriver.updatedAt,
    }
  }
}
