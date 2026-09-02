import request from "supertest"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "@/infra/app.module"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { DatabaseModule } from "@/infra/database/database.module"

import { AdminFactory } from "@/test/factories/make-admin"

describe("Delete Admin (E2E)", () => {
  let jwt: JwtService
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test("[DELETE] /admins/:id", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const adminId = admin.id.toString()

    const accessToken = jwt.sign({ sub: adminId, role: admin.role })

    const response = await request(app.getHttpServer())
      .delete(`/admins/${adminId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const adminOnDatabase = await prisma.user.findUnique({
      where: {
        id: adminId,
        role: "ADMIN",
      },
    })

    expect(adminOnDatabase).toBeNull()
  })
})
