import { Module } from "@nestjs/common"

import { DatabaseModule } from "@/infra/database/database.module"

import { OnOrderWaitingForPickup } from "@/domain/notification/application/subscribers/on-order-waiting-for-pickup"
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification"

@Module({
  imports: [DatabaseModule],
  providers: [OnOrderWaitingForPickup, SendNotificationUseCase],
})
export class EventsModule {}
