import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"

export abstract class AdminRepository {
  abstract create(user: Admin): Promise<void>
  abstract findByCpf(cpf: string): Promise<Admin | null>
}
