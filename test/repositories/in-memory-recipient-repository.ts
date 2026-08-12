import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async findByCpf(cpf: string) {
    const recipient = this.items.find((item) =>
      item.cpf.equals(Cpf.create(cpf)),
    )

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    if (itemIndex >= 0) {
      this.items[itemIndex] = recipient
    }
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.cpf === recipient.cpf)

    this.items.splice(itemIndex, 1)
  }

  async findMany({ page }: PaginationParams) {
    const recipients = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return recipients
  }
}
