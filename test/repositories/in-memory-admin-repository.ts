import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"
import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"
import { PaginationParams } from "@/core/repositories/pagination-params"

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = []

  async findByCpf(cpf: string) {
    const admin = this.items.find((admin) => admin.cpf.equals(Cpf.create(cpf)))

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

  async save(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    if (itemIndex >= 0) {
      this.items[itemIndex] = admin
    }
  }

  async delete(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.cpf === admin.cpf)

    this.items.splice(itemIndex, 1)
  }

  async findMany({ page }: PaginationParams) {
    const admins = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return admins
  }
}
