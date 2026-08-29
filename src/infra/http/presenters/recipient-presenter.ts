import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.raw,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
