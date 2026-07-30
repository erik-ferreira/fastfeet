import { UseCaseError } from "./use-case-error"

export class DataValidationError extends Error implements UseCaseError {
  constructor(message: string) {
    super(`Data is not valid: ${message}`)
  }
}
