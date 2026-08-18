import { Module } from "@nestjs/common"

import { PrismaService } from "./prisma/prisma.service"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"
import { AttachmentRepository } from "@/domain/delivery-and-order/application/repositories/attachment-repository"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"

import { PrismaAdminRepository } from "./prisma/repositories/prisma-admin-repository"
import { PrismaOrderRepository } from "./prisma/repositories/prisma-order-repository"
import { PrismaRecipientRepository } from "./prisma/repositories/prisma-recipient-repository"
import { PrismaAttachmentRepository } from "./prisma/repositories/prisma-attachments-repository"
import { PrismaDeliveryDriverRepository } from "./prisma/repositories/prisma-delivery-driver-repository"

@Module({
  providers: [
    PrismaService,
    { provide: AdminRepository, useClass: PrismaAdminRepository },
    {
      provide: DeliveryDriversRepository,
      useClass: PrismaDeliveryDriverRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
  ],
  exports: [PrismaService, AdminRepository],
})
export class DatabaseModule {}
