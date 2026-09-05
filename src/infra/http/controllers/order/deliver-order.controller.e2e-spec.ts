import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { DatabaseModule } from "@/infra/database/database.module"

import { OrderFactory } from "@/test/factories/make-order"
import { RecipientFactory } from "@/test/factories/make-recipient"
import { AttachmentFactory } from "@/test/factories/make-attachment"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Deliver Order (E2E)", () => {
  let jwt: JwtService
  let app: INestApplication
  let prisma: PrismaService
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let attachmentFactory: AttachmentFactory
  let deliveryDriverFactory: DeliveryDriverFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OrderFactory,
        RecipientFactory,
        AttachmentFactory,
        DeliveryDriverFactory,
      ],
    }).compile()

    jwt = moduleRef.get(JwtService)
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    deliveryDriverFactory = moduleRef.get(DeliveryDriverFactory)

    await app.init()
  })

  test("[PATCH] /orders/:orderId/deliver", async () => {
    const deliveryDriver =
      await deliveryDriverFactory.makePrismaDeliveryDriver()
    const accessToken = jwt.sign({
      sub: deliveryDriver.id.toString(),
      role: deliveryDriver.role,
    })

    const recipient = await recipientFactory.makePrismaRecipient()
    const attachment = await attachmentFactory.makePrismaAttachment()
    const order = await orderFactory.makePrismaOrder({
      status: "WITHDRAWN",
      recipientId: recipient.id,
      deliveryDriverId: deliveryDriver.id,
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/deliver`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        deliveryDriverId: deliveryDriver.id.toString(),
        attachmentId: attachment.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const orderOnDatabase = await prisma.order.findUnique({
      where: { id: orderId, status: "DELIVERED" },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
