import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Fetch Delivery Drivers (E2E)", () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let deliveryDriverFactory: DeliveryDriverFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryDriverFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    deliveryDriverFactory = moduleRef.get(DeliveryDriverFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /admins", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    await Promise.all([
      deliveryDriverFactory.makePrismaDeliveryDriver({
        name: "Delivery Driver 1",
      }),
      deliveryDriverFactory.makePrismaDeliveryDriver({
        name: "Delivery Driver 2",
      }),
      deliveryDriverFactory.makePrismaDeliveryDriver({
        name: "Delivery Driver 3",
      }),
    ])

    const response = await request(app.getHttpServer())
      .get("/delivery-drivers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryDrivers: expect.arrayContaining([
        expect.objectContaining({
          name: "Delivery Driver 1",
        }),
        expect.objectContaining({
          name: "Delivery Driver 2",
        }),
        expect.objectContaining({
          name: "Delivery Driver 3",
        }),
      ]),
    })
  })
})
