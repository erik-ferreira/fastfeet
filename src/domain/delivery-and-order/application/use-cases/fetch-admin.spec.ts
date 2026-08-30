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
    const admin1 = makeAdmin({
      cpf: Cpf.create("10000000000"),
    })
    const admin2 = makeAdmin({
      cpf: Cpf.create("20000000000"),
    })
    const admin3 = makeAdmin({
      cpf: Cpf.create("30000000000"),
    })
    const admin4 = makeAdmin({
      cpf: Cpf.create("40000000000"),
    })

    await inMemoryAdminRepository.create(admin1)
    await inMemoryAdminRepository.create(admin2)
    await inMemoryAdminRepository.create(admin3)
    await inMemoryAdminRepository.create(admin4)

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.admins).toEqual([
        expect.objectContaining({ cpf: Cpf.create("10000000000") }),
        expect.objectContaining({ cpf: Cpf.create("20000000000") }),
        expect.objectContaining({ cpf: Cpf.create("30000000000") }),
        expect.objectContaining({ cpf: Cpf.create("40000000000") }),
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
