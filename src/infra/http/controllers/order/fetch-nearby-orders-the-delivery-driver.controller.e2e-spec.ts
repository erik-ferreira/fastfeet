import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { OrderFactory } from "@/test/factories/make-order"
import { RecipientFactory } from "@/test/factories/make-recipient"

import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Fetch Nearby Orders The Delivery Driver (E2E)", () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory

  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, OrderFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test("[GET] /orders/nearby", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        title: "Order 1",
        recipientId: recipient.id,
        latitude: -3.7985230318432603,
        longitude: -38.50270658640944,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 2",
        recipientId: recipient.id,
        latitude: -3.8070526115399446,
        longitude: -38.52250825601096,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 3",
        recipientId: recipient.id,
        latitude: 7.488826527546869,
        longitude: -5.877033575252279,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 4",
        recipientId: recipient.id,
        latitude: 35.434620517262495,
        longitude: -97.48684705001402,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 5",
        recipientId: recipient.id,
        latitude: 35.12405323939107,
        longitude: -106.5514647680428,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get("/orders/nearby")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({
        latitude: -3.7997961088120045,
        longitude: -38.51125498747482,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          title: "Order 1",
        }),
        expect.objectContaining({
          title: "Order 2",
        }),
      ]),
    })
  })
})
