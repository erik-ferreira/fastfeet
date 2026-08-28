import { Module } from "@nestjs/common"

import { DatabaseModule } from "@/infra/database/database.module"
import { CryptographyModule } from "@/infra/cryptography/cryptography.module"

import { AuthenticateController } from "@/infra/http/controllers/auth/authenticate.controller"
import { ChangePasswordController } from "@/infra/http/controllers/auth/change-password.controller"

import { FetchDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/fetch.controller"
import { CreateDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/create.controller"
import { DeleteDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/delete.controller"

import { AuthenticateUserUseCase } from "@/domain/delivery-and-order/application/use-cases/authenticate-user"
import { ChangeUserPasswordUserUseCase } from "@/domain/delivery-and-order/application/use-cases/change-user-password"

import { FetchDeliveryDriversUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-delivery-drivers"
import { CreateDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/create-delivery-driver"
import { DeleteDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-delivery-driver"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    ChangePasswordController,

    FetchDeliveryDriverController,
    CreateDeliveryDriverController,
    DeleteDeliveryDriverController,
  ],
  providers: [
    AuthenticateUserUseCase,
    ChangeUserPasswordUserUseCase,

    FetchDeliveryDriversUseCase,
    CreateDeliveryDriverUseCase,
    DeleteDeliveryDriverUseCase,
  ],
})
export class HttpModule {}
