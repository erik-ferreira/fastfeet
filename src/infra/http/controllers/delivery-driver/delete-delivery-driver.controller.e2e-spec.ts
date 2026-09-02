import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Delete Delivery Driver (E2E)", () => {
  let jwt: JwtService
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliveryDriverFactory: DeliveryDriverFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryDriverFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryDriverFactory = moduleRef.get(DeliveryDriverFactory)

    await app.init()
  })

  test("[DELETE] /delivery-drivers/:deliveryDriverId", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const deliveryDriver =
      await deliveryDriverFactory.makePrismaDeliveryDriver()

    const deliveryDriverId = deliveryDriver.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/delivery-drivers/${deliveryDriverId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const deliveryDriverOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryDriverId,
        role: "DELIVERY_DRIVER",
      },
    })

    expect(deliveryDriverOnDatabase).toBeNull()
  })
})
