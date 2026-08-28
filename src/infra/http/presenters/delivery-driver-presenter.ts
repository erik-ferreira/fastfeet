import { DeliveryDriver } from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

export class DeliveryDriverPresenter {
  static toHTTP(question: DeliveryDriver) {
    return {
      id: question.id.toString(),
      name: question.name,
      cpf: question.cpf.raw,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
