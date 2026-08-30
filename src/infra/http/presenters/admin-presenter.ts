import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"

export class AdminPresenter {
  static toHTTP(admin: Admin) {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf.raw,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }
}
