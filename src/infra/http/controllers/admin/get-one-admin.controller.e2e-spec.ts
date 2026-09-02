import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"

describe("Get One Admin (E2E)", () => {
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

  test("[GET] /admins/:id", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const firstAdmin = await adminFactory.makePrismaAdmin({
      name: "Admin 1",
    })

    await Promise.all([
      adminFactory.makePrismaAdmin({
        name: "Admin 2",
      }),
      adminFactory.makePrismaAdmin({
        name: "Admin 3",
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/admins/${firstAdmin.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      admin: expect.objectContaining({
        name: "Admin 1",
      }),
    })
  })
})
