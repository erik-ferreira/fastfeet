import { User } from "@/domain/delivery-and-order/enterprise/entities/user"
import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByCpf(cpf: string) {
    const user = this.items.find((user) => user.cpf === cpf)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)
  }
}
