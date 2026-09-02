import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { DatabaseModule } from "@/infra/database/database.module"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { AdminFactory } from "@/test/factories/make-admin"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Edit Delivery Driver (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
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

  test("[PUT] /delivery-drivers/:deliveryDriverId", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const deliveryDriverToEdit =
      await deliveryDriverFactory.makePrismaDeliveryDriver({
        name: "Old name",
        cpf: Cpf.create("12345678900"),
      })

    const response = await request(app.getHttpServer())
      .put(`/delivery-drivers/${deliveryDriverToEdit.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "New name",
        cpf: "09876543210",
      })

    expect(response.statusCode).toBe(204)

    const deliveryDriverOnDatabase = await prisma.user.findFirst({
      where: {
        name: "New name",
        cpf: "09876543210",
        role: "DELIVERY_DRIVER",
      },
    })

    expect(deliveryDriverOnDatabase).toBeTruthy()
  })
})
