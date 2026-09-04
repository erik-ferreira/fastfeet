import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { DatabaseModule } from "@/infra/database/database.module"

import { OrderFactory } from "@/test/factories/make-order"
import { RecipientFactory } from "@/test/factories/make-recipient"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Fetch Orders By Delivery Driver (E2E)", () => {
  let app: INestApplication
  let jwt: JwtService
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let deliveryDriverFactory: DeliveryDriverFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, RecipientFactory, DeliveryDriverFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryDriverFactory = moduleRef.get(DeliveryDriverFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /orders/me", async () => {
    const deliveryDriver =
      await deliveryDriverFactory.makePrismaDeliveryDriver()
    const accessToken = jwt.sign({
      sub: deliveryDriver.id.toString(),
      role: deliveryDriver.role,
    })

    const otherDeliveryDriver =
      await deliveryDriverFactory.makePrismaDeliveryDriver()
    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        title: "Order 1",
        recipientId: recipient.id,
        deliveryDriverId: deliveryDriver.id,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 2",
        recipientId: recipient.id,
        deliveryDriverId: deliveryDriver.id,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 3",
        recipientId: recipient.id,
        deliveryDriverId: deliveryDriver.id,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 4",
        recipientId: recipient.id,
        deliveryDriverId: deliveryDriver.id,
      }),
      orderFactory.makePrismaOrder({
        title: "Order 5",
        recipientId: recipient.id,
        deliveryDriverId: otherDeliveryDriver.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get("/orders/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(4)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          title: "Order 1",
        }),
        expect.objectContaining({
          title: "Order 2",
        }),
        expect.objectContaining({
          title: "Order 3",
        }),
        expect.objectContaining({
          title: "Order 4",
        }),
      ]),
    })
  })
})
