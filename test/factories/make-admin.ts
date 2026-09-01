import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import {
  Admin,
  AdminProps,
} from "@/domain/delivery-and-order/enterprise/entities/admin"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { PrismaAdminMapper } from "@/infra/database/prisma/mappers/prisma-admin-mapper"

type OmitAdminProps = Omit<AdminProps, "role">

export function makeAdmin(
  override: Partial<OmitAdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: Cpf.create(String(faker.string.numeric(11))),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
