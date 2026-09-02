import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import {
  DeliveryDriver,
  DeliveryDriverProps,
} from "@/domain/delivery-and-order/enterprise/entities/delivery-driver"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { PrismaDeliveryDriverMapper } from "@/infra/database/prisma/mappers/prisma-delivery-driver-mapper"

type OmitDeliveryDriverProps = Omit<DeliveryDriverProps, "role">

export function makeDeliveryDriver(
  override: Partial<OmitDeliveryDriverProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryDriver = DeliveryDriver.create(
    {
      name: faker.person.fullName(),
      cpf: Cpf.create(String(faker.string.numeric(11))),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryDriver
}

@Injectable()
export class DeliveryDriverFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryDriver(
    data: Partial<DeliveryDriverProps> = {},
  ): Promise<DeliveryDriver> {
    const deliveryDriver = makeDeliveryDriver(data)

    await this.prisma.user.create({
      data: PrismaDeliveryDriverMapper.toPrisma(deliveryDriver),
    })

    return deliveryDriver
  }
}
