import { hash } from "bcryptjs"
import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

describe("Change Password (E2E)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[POST] /sessions/change-password/:userId", async () => {
    const admin = await adminFactory.makePrismaAdmin({
      cpf: Cpf.create("12345678900"),
      password: await hash("123456", 8),
    })

    const adminId = admin.id.toString()

    const accessToken = jwt.sign({ sub: adminId, role: admin.role })

    const response = await request(app.getHttpServer())
      .post(`/sessions/change-password/${adminId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        newPassword: "654321",
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      message: expect.any(String),
    })
  })
})
