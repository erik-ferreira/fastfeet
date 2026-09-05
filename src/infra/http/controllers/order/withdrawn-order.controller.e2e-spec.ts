import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { OrderFactory } from "@/test/factories/make-order"
import { RecipientFactory } from "@/test/factories/make-recipient"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Withdrawn Order (E2E)", () => {
  let jwt: JwtService
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let deliveryDriverFactory: DeliveryDriverFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        OrderFactory,
        RecipientFactory,
        DeliveryDriverFactory,
      ],
    }).compile()

    jwt = moduleRef.get(JwtService)
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    orderFactory = moduleRef.get(OrderFactory)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryDriverFactory = moduleRef.get(DeliveryDriverFactory)

    await app.init()
  })

  test("[PATCH] /orders/:orderId/withdrawn-order", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const deliveryDriver =
      await deliveryDriverFactory.makePrismaDeliveryDriver()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      status: "WAITING",
      recipientId: recipient.id,
      deliveryDriverId: deliveryDriver.id,
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/withdrawn-order`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ deliveryDriverId: deliveryDriver.id.toString() })

    expect(response.statusCode).toBe(200)

    const orderOnDatabase = await prisma.order.findUnique({
      where: { id: orderId, status: "WITHDRAWN" },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
