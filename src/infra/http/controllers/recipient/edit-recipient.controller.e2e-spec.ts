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

describe("Edit Recipient (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test("[PUT] /recipients/:recipientId", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const recipientToEdit = await recipientFactory.makePrismaRecipient({
      name: "Old name",
      cpf: Cpf.create("12345678900"),
    })

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipientToEdit.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "New name",
        cpf: "09876543210",
      })

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: "New name",
        cpf: "09876543210",
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
