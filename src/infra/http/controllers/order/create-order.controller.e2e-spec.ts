import { hash } from "bcryptjs"
import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

import { DatabaseModule } from "@/infra/database/database.module"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { AdminFactory } from "@/test/factories/make-admin"
import { RecipientFactory } from "@/test/factories/make-recipient"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Create Order (E2E)", () => {
  let jwt: JwtService
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let deliveryDriverFactory: DeliveryDriverFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, DeliveryDriverFactory],
    }).compile()

    jwt = moduleRef.get(JwtService)
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryDriverFactory = moduleRef.get(DeliveryDriverFactory)

    await app.init()
  })

  test("[POST] /orders", async () => {
    const admin = await adminFactory.makePrismaAdmin({
      cpf: Cpf.create("12345678900"),
      password: await hash("123456", 8),
    })
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const recipient = await recipientFactory.makePrismaRecipient({
      name: "John Doe",
      cpf: Cpf.create("00123456789"),
    })

    const deliveryDriver = await deliveryDriverFactory.makePrismaDeliveryDriver(
      {
        name: "Jane Doe",
        cpf: Cpf.create("00987654321"),
      },
    )

    const response = await request(app.getHttpServer())
      .post("/orders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "2 Combos completos",
        status: "PENDING",
        latitude: -3.7949895383702774,
        longitude: -38.48412381970672,
        recipientId: recipient.id.toString(),
        deliveryDriverId: deliveryDriver.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findUnique({
      where: { id: response.body.order.id },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
