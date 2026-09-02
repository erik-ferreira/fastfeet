import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { RecipientFactory } from "@/test/factories/make-recipient"

describe("Fetch Recipients (E2E)", () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /recipients", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    await Promise.all([
      recipientFactory.makePrismaRecipient({
        name: "Recipient 1",
      }),
      recipientFactory.makePrismaRecipient({
        name: "Recipient 2",
      }),
      recipientFactory.makePrismaRecipient({
        name: "Recipient 3",
      }),
    ])

    const response = await request(app.getHttpServer())
      .get("/recipients")
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({
          name: "Recipient 1",
        }),
        expect.objectContaining({
          name: "Recipient 2",
        }),
        expect.objectContaining({
          name: "Recipient 3",
        }),
      ]),
    })
  })
})
