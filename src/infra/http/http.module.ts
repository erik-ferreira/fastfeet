import { Module } from "@nestjs/common"

import { DatabaseModule } from "@/infra/database/database.module"
import { CryptographyModule } from "@/infra/cryptography/cryptography.module"

import { AuthenticateController } from "@/infra/http/controllers/auth/authenticate.controller"
import { ChangePasswordController } from "@/infra/http/controllers/auth/change-password.controller"

import { FetchDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/fetch.controller"
import { GetOneDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/get-one.controller"
import { CreateDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/create.controller"
import { EditDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/edit.controller"
import { DeleteDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/delete.controller"

import { AuthenticateUserUseCase } from "@/domain/delivery-and-order/application/use-cases/authenticate-user"
import { ChangeUserPasswordUserUseCase } from "@/domain/delivery-and-order/application/use-cases/change-user-password"

import { FetchDeliveryDriversUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-delivery-drivers"
import { GetDeliveryDriverByCpfUseCase } from "@/domain/delivery-and-order/application/use-cases/get-delivery-driver-by-cpf"
import { CreateDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/create-delivery-driver"
import { EditDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-delivery-driver"
import { DeleteDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-delivery-driver"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    ChangePasswordController,

    FetchDeliveryDriverController,
    GetOneDeliveryDriverController,
    CreateDeliveryDriverController,
    EditDeliveryDriverController,
    DeleteDeliveryDriverController,
  ],
  providers: [
    AuthenticateUserUseCase,
    ChangeUserPasswordUserUseCase,

    FetchDeliveryDriversUseCase,
    GetDeliveryDriverByCpfUseCase,
    CreateDeliveryDriverUseCase,
    EditDeliveryDriverUseCase,
    DeleteDeliveryDriverUseCase,
  ],
})
export class HttpModule {}
