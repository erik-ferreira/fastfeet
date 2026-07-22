import { UseCaseError } from "@/core/errors/use-case-error"

export class AlreadyExistsError extends Error implements UseCaseError {
  constructor(entity: string, identifier: string) {
    super(`${entity} "${identifier}" already exists.`)
  }
}
