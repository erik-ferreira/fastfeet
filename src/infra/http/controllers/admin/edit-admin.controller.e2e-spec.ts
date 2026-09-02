import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

describe("Edit Admin (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test("[PUT] /admins/:id", async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const adminToEdit = await adminFactory.makePrismaAdmin({
      name: "Old name",
      cpf: Cpf.create("12345678900"),
    })

    const adminIdToEdit = adminToEdit.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/admins/${adminIdToEdit}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "New name",
        cpf: "09876543210",
      })

    expect(response.statusCode).toBe(204)

    const adminOnDatabase = await prisma.user.findFirst({
      where: {
        name: "New name",
        cpf: "09876543210",
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })
})
