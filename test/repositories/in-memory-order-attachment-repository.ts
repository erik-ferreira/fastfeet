import { OrderAttachment } from "@/domain/delivery-and-order/enterprise/entities/order-attachment"
import { OrderAttachmentRepository } from "@/domain/delivery-and-order/application/repositories/order-attachment-repository"

export class InMemoryOrderAttachmentRepository implements OrderAttachmentRepository {
  public items: OrderAttachment[] = []

  async createMany(attachments: OrderAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: OrderAttachment[]): Promise<void> {
    const orderAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = orderAttachments
  }

  async findManyByOrderId(orderId: string): Promise<OrderAttachment[]> {
    const orderAttachments = this.items.filter(
      (item) => item.orderId.toString() === orderId,
    )

    return orderAttachments
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    const orderAttachments = this.items.filter(
      (item) => item.orderId.toString() !== orderId,
    )

    this.items = orderAttachments
  }
}
