import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"

import { User } from "@/domain/delivery-and-order/enterprise/entities/abstract/user"

import { PrismaUserMapper } from "../mappers/prisma-user-mapper"

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({ data })
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: { id: user.id.toString() },
      data,
    })
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }
}
