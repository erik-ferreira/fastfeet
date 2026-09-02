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

import { CreateOrderController } from "@/infra/http/controllers/order/create-order.controller"
import { DeleteOrderController } from "@/infra/http/controllers/order/delete-order.controller"
import { DeliverOrderController } from "@/infra/http/controllers/order/deliver-order.controller"
import { EditOrderController } from "@/infra/http/controllers/order/edit-order.controller"
import { FetchNearbyOrdersTheDeliveryDriverController } from "@/infra/http/controllers/order/fetch-nearby-orders-the-delivery-driver.controller"
import { FetchOrdersByDeliveryDriverController } from "@/infra/http/controllers/order/fetch-orders-by-delivery-driver.controller"
import { FetchOrdersFromSpecificRecipientController } from "@/infra/http/controllers/order/fetch-orders-from-specific-recipient.controller"
import { FetchOrderController } from "@/infra/http/controllers/order/fetch-orders.controller"
import { GetOneOrderController } from "@/infra/http/controllers/order/get-order.controller"
import { MarkOrderAsWaitingController } from "@/infra/http/controllers/order/mark-order-as-waiting.controller"
import { ReturnOrderController } from "@/infra/http/controllers/order/return-order.controller"
import { WithdrawnOrderController } from "@/infra/http/controllers/order/withdrawn-order.controller"

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

import { CreateOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/create-order"
import { DeleteOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/delete-order"
import { DeliverOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/deliver-order"
import { EditOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/edit-order"
import { FetchNearbyOrdersTheDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-nearby-orders-the-delivery-driver"
import { FetchOrdersDeliveryDriverUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-orders-delivery-driver"
import { FetchOrdersFromSpecificRecipientUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-orders-from-specific-recipient"
import { FetchOrdersUseCase } from "@/domain/delivery-and-order/application/use-cases/fetch-orders"
import { GetOrderDetailsUseCase } from "@/domain/delivery-and-order/application/use-cases/get-order-details"
import { MarkOrderAsWaitingUseCase } from "@/domain/delivery-and-order/application/use-cases/mark-order-as-waiting"
import { ReturnOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/return-order"
import { WithdrawnOrderUseCase } from "@/domain/delivery-and-order/application/use-cases/withdrawn-order"

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

    CreateOrderController,
    DeleteOrderController,
    DeliverOrderController,
    EditOrderController,
    FetchNearbyOrdersTheDeliveryDriverController,
    FetchOrdersByDeliveryDriverController,
    FetchOrdersFromSpecificRecipientController,
    FetchOrderController,
    GetOneOrderController,
    MarkOrderAsWaitingController,
    ReturnOrderController,
    WithdrawnOrderController,
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

    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeliverOrderUseCase,
    EditOrderUseCase,
    FetchNearbyOrdersTheDeliveryDriverUseCase,
    FetchOrdersDeliveryDriverUseCase,
    FetchOrdersFromSpecificRecipientUseCase,
    FetchOrdersUseCase,
    GetOrderDetailsUseCase,
    MarkOrderAsWaitingUseCase,
    ReturnOrderUseCase,
    WithdrawnOrderUseCase,
  ],
})
export class HttpModule {}
