import { Order } from "@/domain/delivery-and-order/enterprise/entities/order"

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      title: order.title,
      status: order.status,
      latitude: order.latitude,
      longitude: order.longitude,

      recipientId: order.recipientId,
      deliveryDriverId: order.deliveryDriverId,
      attachmentId: order.attachmentId,

      postedAt: order.postedAt,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
