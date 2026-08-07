import { Module } from "@nestjs/common"

import { PrismaService } from "./prisma/prisma.service"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { PrismaAdminRepository } from "./prisma/repositories/prisma-admin-repository"
import { PrismaDeliveryDriverRepository } from "./prisma/repositories/prisma-delivery-driver-repository"

@Module({
  providers: [
    PrismaService,
    { provide: AdminRepository, useClass: PrismaAdminRepository },
    {
      provide: DeliveryDriversRepository,
      useClass: PrismaDeliveryDriverRepository,
    },
  ],
  exports: [PrismaService, AdminRepository],
})
export class DatabaseModule {}
