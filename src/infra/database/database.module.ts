import { Module } from "@nestjs/common"

import { PrismaService } from "./prisma/prisma.service"

import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"
import { OrderRepository } from "@/domain/delivery-and-order/application/repositories/order-repository"
import { RecipientRepository } from "@/domain/delivery-and-order/application/repositories/recipient-repository"
import { UserRepository } from "@/domain/delivery-and-order/application/repositories/user-repository"
import { AttachmentRepository } from "@/domain/delivery-and-order/application/repositories/attachment-repository"
import { OrderAttachmentRepository } from "@/domain/delivery-and-order/application/repositories/order-attachment-repository"
import { DeliveryDriversRepository } from "@/domain/delivery-and-order/application/repositories/delivery-drivers-repository"
import { NotificationsRepository } from "@/domain/notification/application/repositories/notification-repository"

import { PrismaAdminRepository } from "./prisma/repositories/prisma-admin-repository"
import { PrismaOrderRepository } from "./prisma/repositories/prisma-order-repository"
import { PrismaRecipientRepository } from "./prisma/repositories/prisma-recipient-repository"
import { PrismaUserRepository } from "./prisma/repositories/prisma-user-repository"
import { PrismaAttachmentRepository } from "./prisma/repositories/prisma-attachments-repository"
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository"
import { PrismaDeliveryDriverRepository } from "./prisma/repositories/prisma-delivery-driver-repository"
import { PrismaOrderAttachmentRepository } from "./prisma/repositories/prisma-order-attachment-repository"

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
    {
      provide: OrderAttachmentRepository,
      useClass: PrismaOrderAttachmentRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminRepository,
    DeliveryDriversRepository,
    RecipientRepository,
    OrderRepository,
    AttachmentRepository,
    OrderAttachmentRepository,
    UserRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
