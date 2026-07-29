import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper"

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({ data })
  }

  async findByCpf(cpf: string): Promise<Admin | null> {
    const user = await this.prisma.user.findUnique({ where: { cpf } })

    if (!user) {
      return null
    }

    return PrismaAdminMapper.toDomain(user)
  }

  async findById(id: string): Promise<Admin | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      return null
    }

    return PrismaAdminMapper.toDomain(user)
  }
}
