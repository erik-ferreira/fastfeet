import { z } from "zod"
import { fromZodError } from "zod-validation-error"
import { PipeTransform, BadRequestException } from "@nestjs/common"

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)

      return parsedValue
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          errors: fromZodError(error),
          message: "Validation failed",
          statusCode: 400,
        })
      }

      throw new BadRequestException("Validation failed")
    }
  }
}
