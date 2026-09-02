import { Module } from "@nestjs/common"

import { DatabaseModule } from "@/infra/database/database.module"
import { CryptographyModule } from "@/infra/cryptography/cryptography.module"

import { AuthenticateController } from "@/infra/http/controllers/auth/authenticate.controller"
import { ChangePasswordController } from "@/infra/http/controllers/auth/change-password.controller"

import { FetchAdminController } from "@/infra/http/controllers/admin/fetch-admins.controller"
import { GetOneAdminController } from "@/infra/http/controllers/admin/get-one-admin.controller"
import { CreateAdminController } from "@/infra/http/controllers/admin/create-admin.controller"
import { EditAdminController } from "@/infra/http/controllers/admin/edit-admin.controller"
import { DeleteAdminController } from "@/infra/http/controllers/admin/delete-admin.controller"

import { FetchDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/fetch-delivery-driver.controller"
import { GetOneDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/get-one-delivery-driver.controller"
import { CreateDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/create-delivery-driver.controller"
import { EditDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/edit-delivery-driver.controller"
import { DeleteDeliveryDriverController } from "@/infra/http/controllers/delivery-driver/delete-delivery-driver.controller"

import { FetchRecipientController } from "@/infra/http/controllers/recipient/fetch-recipient.controller"
import { GetOneRecipientController } from "@/infra/http/controllers/recipient/get-one-recipient.controller"
import { CreateRecipientController } from "@/infra/http/controllers/recipient/create-recipient.controller"
import { EditRecipientController } from "@/infra/http/controllers/recipient/edit-recipient.controller"
import { DeleteRecipientController } from "@/infra/http/controllers/recipient/delete-recipient.controller"

// --------------------- use cases ---------------------

import { AuthenticateUserUseCase } from "@/domain/delivery-and-order/application/use-cases/authenticate-user"
import { ChangeUserPasswordUserUseCase } from "@/domain/delivery-and-order/application/use-cases/change-user-password"

import { FetchRecipientsUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-recipients"
import { GetRecipientByCpfUseCase } from "@/domain/delivery-and-order/application/use-cases/get-recipient-by-cpf"
import { CreateRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/create-recipient"
import { EditRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-recipient"
import { DeleteRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-recipient"

import { FetchDeliveryDriversUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-delivery-drivers"
import { GetDeliveryDriverByCpfUseCase } from "@/domain/delivery-and-order/application/use-cases/get-delivery-driver-by-cpf"
import { CreateDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/create-delivery-driver"
import { EditDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-delivery-driver"
import { DeleteDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-delivery-driver"

import { FetchAdminsUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-admins"
import { GetAdminByIdUseCase } from "@/domain/delivery-and-order/application/use-cases/get-admin-by-id"
import { CreateAdminUseCase } from "@/domain/delivery-and-order/application/use-cases/create-admin"
import { EditAdminUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-admin"
import { DeleteAdminUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-admin"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    ChangePasswordController,

    FetchAdminController,
    GetOneAdminController,
    CreateAdminController,
    EditAdminController,
    DeleteAdminController,

    FetchDeliveryDriverController,
    GetOneDeliveryDriverController,
    CreateDeliveryDriverController,
    EditDeliveryDriverController,
    DeleteDeliveryDriverController,

    FetchRecipientController,
    GetOneRecipientController,
    CreateRecipientController,
    EditRecipientController,
    DeleteRecipientController,
  ],
  providers: [
    AuthenticateUserUseCase,
    ChangeUserPasswordUserUseCase,

    FetchAdminsUseCase,
    GetAdminByIdUseCase,
    CreateAdminUseCase,
    EditAdminUseCase,
    DeleteAdminUseCase,

    FetchDeliveryDriversUseCase,
    GetDeliveryDriverByCpfUseCase,
    CreateDeliveryDriverUseCase,
    EditDeliveryDriverUseCase,
    DeleteDeliveryDriverUseCase,

    FetchRecipientsUseCase,
    GetRecipientByCpfUseCase,
    CreateRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
  ],
})
export class HttpModule {}
