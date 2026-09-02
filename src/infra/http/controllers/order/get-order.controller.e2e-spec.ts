import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { AdminFactory } from "@/test/factories/make-admin"
import { OrderFactory } from "@/test/factories/make-order"
import { RecipientFactory } from "@/test/factories/make-recipient"

describe("Get Order (E2E)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

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

    await app.init()
  })

  test("[GET] /orders/:orderId", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const recipient = await recipientFactory.makePrismaRecipient()

    const firstOrder = await orderFactory.makePrismaOrder({
      title: "Order 1",
      recipientId: recipient.id,
    })

    await Promise.all([
      orderFactory.makePrismaOrder({
        title: "Order 2",
        recipientId: recipient.id,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 3",
        recipientId: recipient.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/orders/${firstOrder.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      order: expect.objectContaining({
        title: "Order 1",
      }),
    })
  })
})
