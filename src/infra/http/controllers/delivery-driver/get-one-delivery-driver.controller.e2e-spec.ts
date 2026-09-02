import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { AdminFactory } from "@/test/factories/make-admin"
import { DeliveryDriverFactory } from "@/test/factories/make-delivery-driver"

describe("Get One Delivery Driver (E2E)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let deliveryDriverFactory: DeliveryDriverFactory
  let jwt: JwtService

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

  test("[GET] /delivery-drivers/:deliveryDriverCpf", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const firstDeliveryDriver =
      await deliveryDriverFactory.makePrismaDeliveryDriver({
        name: "Delivery Driver 1",
        cpf: Cpf.create("00000000011"),
      })

    await Promise.all([
      deliveryDriverFactory.makePrismaDeliveryDriver({
        name: "Delivery Driver 2",
        cpf: Cpf.create("00000000022"),
      }),
      deliveryDriverFactory.makePrismaDeliveryDriver({
        name: "Delivery Driver 3",
        cpf: Cpf.create("00000000033"),
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/delivery-drivers/${firstDeliveryDriver.cpf.raw}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryDriver: expect.objectContaining({
        name: "Delivery Driver 1",
      }),
    })
  })
})
