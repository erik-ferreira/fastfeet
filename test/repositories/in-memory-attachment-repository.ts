import { Attachment } from "@/domain/delivery-and-order/enterprise/entities/attachment"
import { AttachmentRepository } from "@/domain/delivery-and-order/application/repositories/attachment-repository"

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
