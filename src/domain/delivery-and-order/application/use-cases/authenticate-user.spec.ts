import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { FakeEncrypter } from "@/test/cryptography/fake-encrypter"

import { makeAdmin } from "@/test/factories/make-admin"
import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"

import { AuthenticateUserUseCase } from "./authenticate-user"
import { Cpf } from "../../enterprise/entities/value-objects/cpf"

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryAdminRepository: InMemoryAdminRepository

let sut: AuthenticateUserUseCase

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryAdminRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it("should be able to authenticate a admin", async () => {
    const user = makeAdmin({
      cpf: Cpf.create("09809809811"),
      password: await fakeHasher.hash("123456"),
    })

    inMemoryAdminRepository.items.push(user)

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
