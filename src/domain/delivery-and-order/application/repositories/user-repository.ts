import { User } from "@/domain/delivery-and-order/enterprise/entities/abstract/user"

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
}
