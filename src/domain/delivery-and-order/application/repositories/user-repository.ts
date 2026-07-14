import { User } from "@/domain/delivery-and-order/enterprise/entities/user"

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>
}
