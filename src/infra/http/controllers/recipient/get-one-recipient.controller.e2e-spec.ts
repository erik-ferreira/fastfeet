import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { AdminFactory } from "@/test/factories/make-admin"
import { RecipientFactory } from "@/test/factories/make-recipient"

describe("Get One Recipient (E2E)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

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

  test("[GET] /recipients/:recipientCpf", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const firstRecipient = await recipientFactory.makePrismaRecipient({
      name: "Recipient 1",
      cpf: Cpf.create("00000000011"),
    })

    await Promise.all([
      recipientFactory.makePrismaRecipient({
        name: "Recipient 2",
        cpf: Cpf.create("00000000022"),
      }),
      recipientFactory.makePrismaRecipient({
        name: "Recipient 3",
        cpf: Cpf.create("00000000033"),
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/recipients/${firstRecipient.cpf.raw}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        name: "Recipient 1",
      }),
    })
  })
})
