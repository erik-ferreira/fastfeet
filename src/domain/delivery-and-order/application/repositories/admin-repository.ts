import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>
  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract findById(id: string): Promise<Admin | null>
}
