import { makeUser } from "@/test/factories/make-user"
import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { InMemoryUserRepository } from "@/test/repositories/in-memory-user-repository"

import { ChangeUserPasswordUserUseCase } from "./change-user-password"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: ChangeUserPasswordUserUseCase

describe("Change User Password", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeUserPasswordUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it("should be able to change a user password", async () => {
    const user = makeUser({
      password: "123456",
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      newPassword: "abcdef",
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items).toHaveLength(1)
    expect(inMemoryUserRepository.items).toEqual([
      expect.objectContaining({ password: expect.stringContaining("abcdef") }),
    ])
  })

  it("should not be able to change a password with user not found", async () => {
    const result = await sut.execute({
      userId: "user-id-non-exists",
      newPassword: "abcdef",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
