import { FakeHasher } from "@/test/cryptography/fake-hasher"

import { InMemoryUserRepository } from "@/test/repositories/in-memory-user-repository"

import { RegisterUserUseCase } from "./register-user"

let fakeHasher: FakeHasher
let inMemoryUserRepository: InMemoryUserRepository

let sut: RegisterUserUseCase

describe("Register User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it("should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "John Doe",
      cpf: "00000000000",
      password: "12345",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUserRepository.items[0],
    })
  })

  it("should hash student password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      cpf: "00000000000",
      password: "123456",
    })

    const hashedPassword = await fakeHasher.hash("123456")

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toEqual(hashedPassword)
  })
})
