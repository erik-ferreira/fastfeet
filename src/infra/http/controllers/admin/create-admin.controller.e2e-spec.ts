import { hash } from "bcryptjs"
import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { DatabaseModule } from "@/infra/database/database.module"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { AdminFactory } from "@/test/factories/make-admin"

describe("Create Admin (E2E)", () => {
  let jwt: JwtService
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    jwt = moduleRef.get(JwtService)
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test("[POST] /admins", async () => {
    const admin = await adminFactory.makePrismaAdmin({
      cpf: Cpf.create("12345678900"),
      password: await hash("123456", 8),
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const response = await request(app.getHttpServer())
      .post("/admins")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe",
        cpf: "00123456789",
        password: "123456",
      })

    console.log("error", response.body)

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: { cpf: "12345678900" },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
