import { Attachment } from "@/domain/delivery-and-order/enterprise/entities/attachment"

export abstract class AttachmentRepository {
  abstract create(attachment: Attachment): Promise<void>
}
