import { DataValidationError } from "@/core/errors/data-validation-error"

export class Cpf {
  private value: string

  private constructor(value: string) {
    const cpfOnlyNumbers = value.replace(/\D/g, "")

    if (cpfOnlyNumbers.length !== 11) {
      throw new DataValidationError("Cpf length incorrectly")
    }

    this.value = cpfOnlyNumbers
  }

  static create(value: string) {
    return new Cpf(value)
  }

  get raw() {
    return this.value
  }

  get format() {
    return this.value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
  }

  equals(cpf: Cpf) {
    return this.value === cpf.value
  }
}
