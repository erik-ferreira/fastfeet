import { PaginationParams } from "@/core/repositories/pagination-params"
import { Recipient } from "@/domain/delivery-and-order/enterprise/entities/recipient"

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract update(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByCpf(cpf: string): Promise<Recipient | null>
  abstract findMany(params: PaginationParams): Promise<Recipient[]>
}
