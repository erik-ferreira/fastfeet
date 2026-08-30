import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { Admin } from "@/domain/delivery-and-order/enterprise/entities/admin"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"

import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper"
import { PaginationParams } from "@/core/repositories/pagination-params"

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({ data })
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: { id: admin.id.toString() },
      data,
    })
  }

  async delete(admin: Admin): Promise<void> {
    await this.prisma.user.delete({
      where: { id: admin.id.toString() },
    })
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

  async findMany({ page }: PaginationParams): Promise<Admin[]> {
    const admin = await this.prisma.user.findMany({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: (page - 1) * 20,
    })

    return admin.map(PrismaAdminMapper.toDomain)
  }
}
