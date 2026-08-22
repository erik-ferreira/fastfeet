import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification-repository"
import { SendNotificationUseCase } from "./send-notification"

let sut: SendNotificationUseCase
let inMemoryNotificationRepository: InMemoryNotificationRepository

describe("Send Notification", () => {
  beforeAll(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "Nova notificação",
      content: "Conteúdo da nova notificação",
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
