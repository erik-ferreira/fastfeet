import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { FakeEncrypter } from "@/test/cryptography/fake-encrypter"

import { makeUser } from "@/test/factories/make-user"
import { InMemoryUserRepository } from "@/test/repositories/in-memory-user-repository"

import { AuthenticateUserUseCase } from "./authenticate-user"

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryUserRepository: InMemoryUserRepository

let sut: AuthenticateUserUseCase

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it("should be able to authenticate a user", async () => {
    const user = makeUser({
      cpf: "09809809811",
      password: await fakeHasher.hash("123456"),
    })

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      cpf: "09809809811",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
