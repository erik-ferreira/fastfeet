import { Module } from "@nestjs/common"

import { DatabaseModule } from "@/infra/database/database.module"

import { OnOrderWaitingForPickup } from "@/domain/notification/application/subscribers/on-order-waiting-for-pickup"
import { OnOrderDeliveredToRecipient } from "@/domain/notification/application/subscribers/on-order-delivered-to-recipient"
import { OnOrderReturned } from "@/domain/notification/application/subscribers/on-order-returned"
import { OnOrderWithdrawnByDeliveryDriver } from "@/domain/notification/application/subscribers/on-order-withdrawn-by-delivery-driver"
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification"

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderWaitingForPickup,
    OnOrderDeliveredToRecipient,
    OnOrderReturned,
    OnOrderWithdrawnByDeliveryDriver,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
