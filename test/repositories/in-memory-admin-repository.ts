import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = []

  async findByCpf(cpf: string) {
    const admin = this.items.find((admin) => admin.cpf === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(admin: Admin) {
    this.items.push(admin)
  }
}
