import { makeAdmin } from "@/test/factories/make-admin"

import { InMemoryAdminRepository } from "@/test/repositories/in-memory-admin-repository"

import { Cpf } from "@/domain/delivery-and-order/enterprise/entities/value-objects/cpf"

import { FetchAdminsUseCase } from "./fetch-admins"

let inMemoryAdminRepository: InMemoryAdminRepository
let sut: FetchAdminsUseCase

describe("Fetch Admins", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new FetchAdminsUseCase(inMemoryAdminRepository)
  })

  it("should be able to fetch admins", async () => {
    await inMemoryAdminRepository.create(
      makeAdmin({
        createdAt: new Date(2026, 7, 31),
      }),
    )
    await inMemoryAdminRepository.create(
      makeAdmin({
        createdAt: new Date(2026, 7, 28),
      }),
    )
    await inMemoryAdminRepository.create(
      makeAdmin({
        createdAt: new Date(2026, 7, 25),
      }),
    )
    await inMemoryAdminRepository.create(
      makeAdmin({
        createdAt: new Date(2026, 7, 10),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.admins).toEqual([
        expect.objectContaining({ createdAt: new Date(2026, 7, 31) }),
        expect.objectContaining({ createdAt: new Date(2026, 7, 28) }),
        expect.objectContaining({ createdAt: new Date(2026, 7, 25) }),
        expect.objectContaining({ createdAt: new Date(2026, 7, 10) }),
      ])
    }
  })

  it("should be able to fetch paginated admins", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAdminRepository.create(
        makeAdmin({
          cpf: Cpf.create(i <= 9 ? `0${i}000000000` : `${i}000000000`),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.admins).toHaveLength(2)
    }
  })
})
