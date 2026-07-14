import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { User } from "@/domain/delivery-and-order/enterprise/entities/user"

import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"

import { PrismaUserMapper } from "../mappers/prisma-user-mapper"

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({ data })
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { cpf } })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }
}
