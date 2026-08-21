import { User } from "@/domain/delivery-and-order/enterprise/entities/abstract/user"
import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    if (itemIndex >= 0) {
      this.items[itemIndex] = user
    }
  }
}
