import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { Optional } from "@/core/types/optional"

import { OrderDeliveredToRecipientEvent } from "@/domain/delivery-and-order/enterprise/events/order-delivered-to-recipient-event"
import { OrderReturnedEvent } from "@/domain/delivery-and-order/enterprise/events/order-returned-event"
import { OrderWaitingForPickupEvent } from "@/domain/delivery-and-order/enterprise/events/order-waiting-for-pickup-event"
import { OrderWithdrawnByDeliveryDriverEvent } from "@/domain/delivery-and-order/enterprise/events/order-withdrawn-by-delivery-driver-event"

export type OrderStatus =
  "PENDING" | "WAITING" | "WITHDRAWN" | "DELIVERED" | "RETURNED"

export interface OrderProps {
  title: string
  status: OrderStatus
  latitude: number
  longitude: number

  recipientId: UniqueEntityID
  deliveryDriverId?: UniqueEntityID | null
  attachmentId?: UniqueEntityID | null

  postedAt?: Date | null
  withdrawnAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null

  createdAt: Date
  updatedAt?: Date | null
}

export type OrderCreateProps = Optional<
  OrderProps,
  "status" | "createdAt" | "updatedAt"
>

interface OrderUpdateProps {
  title?: string
  latitude?: number
  longitude?: number
  recipientId?: UniqueEntityID
}

export class Order extends AggregateRoot<OrderProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get status() {
    return this.props.status
  }

  get latitude(): number {
    return this.props.latitude
  }

  get longitude(): number {
    return this.props.longitude
  }

  get recipientId() {
    return this.props.recipientId
  }

  get deliveryDriverId() {
    return this.props.deliveryDriverId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  get postedAt() {
    return this.props.postedAt
  }

  get withdrawnAt() {
    return this.props.withdrawnAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  /**
   * Mark the order as awaiting pickup
   */
  markAsWaiting() {
    this.props.status = "WAITING"
    this.props.postedAt = new Date()

    this.addDomainEvent(new OrderWaitingForPickupEvent(this))

    this.touch()
  }

  /**
   * The order will be picked up by a delivery driver
   */
  withdrawn(deliveryDriverId: UniqueEntityID) {
    if (this.props.status !== "WAITING" && this.props.status !== "PENDING") {
      throw new Error("Only pending or waiting orders can be withdrawn.")
    }

    this.props.deliveryDriverId = deliveryDriverId
    this.props.status = "WITHDRAWN"
    this.props.withdrawnAt = new Date()

    this.addDomainEvent(new OrderWithdrawnByDeliveryDriverEvent(this))

    this.touch()
  }

  /**
   * Mark the order as delivered by providing a photo of the receipt
   */
  deliver(deliveryDriverId: UniqueEntityID, attachmentId: UniqueEntityID) {
    if (this.props.status !== "WITHDRAWN") {
      throw new Error("Only withdrawn orders can be marked as delivered.")
    }

    if (!this.props.deliveryDriverId) {
      throw new Error("Order must have an assigned driver to be delivered.")
    }

    if (!this.props.deliveryDriverId.equals(deliveryDriverId)) {
      throw new Error("The order must be delivered by the assigned driver.")
    }

    this.props.attachmentId = attachmentId
    this.props.status = "DELIVERED"
    this.props.deliveredAt = new Date()

    this.addDomainEvent(new OrderDeliveredToRecipientEvent(this))

    this.touch()
  }

  /**
   * Mark the order as returned
   */
  returnOrder() {
    if (this.props.status !== "WITHDRAWN") {
      throw new Error("Only withdrawn orders can be returned.")
    }

    this.props.status = "RETURNED"
    this.props.returnedAt = new Date()

    this.addDomainEvent(new OrderReturnedEvent(this))

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: OrderCreateProps, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? "PENDING",
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )

    return order
  }

  update({ title, latitude, longitude, recipientId }: OrderUpdateProps) {
    if (this.props.status === "DELIVERED" || this.props.status === "RETURNED") {
      throw new Error(
        "Cannot edit orders that are already delivered or returned.",
      )
    }

    this.props.title = title ?? this.props.title
    this.props.latitude = latitude ?? this.props.latitude
    this.props.longitude = longitude ?? this.props.longitude
    this.props.recipientId = recipientId ?? this.props.recipientId
    this.touch()
  }
}
