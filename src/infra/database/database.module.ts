import { Module } from "@nestjs/common"

import { PrismaService } from "./prisma/prisma.service"
import { AdminRepository } from "@/domain/delivery-and-order/application/repositories/admin-repository"
import { PrismaAdminRepository } from "./prisma/repositories/prisma-admin-repository"

@Module({
  providers: [
    PrismaService,
    { provide: AdminRepository, useClass: PrismaAdminRepository },
  ],
  exports: [PrismaService, AdminRepository],
})
export class DatabaseModule {}
