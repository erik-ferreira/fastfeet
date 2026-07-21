import { UseCaseError } from "@/core/errors/use-case-error"

export class OperatorAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User "${identifier}" already exists.`)
  }
}
