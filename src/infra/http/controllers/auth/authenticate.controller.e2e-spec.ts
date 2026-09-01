import { hash } from "bcryptjs"
import request from "supertest"
import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

describe("Authenticate (E2E)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test("[POST] /sessions", async () => {
    await adminFactory.makePrismaAdmin({
      cpf: Cpf.create("12345678900"),
      password: await hash("123456", 8),
    })

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "12345678900",
      password: "123456",
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
