import { ZodError, ZodSchema } from 'zod'
import { SchemaValidationMiddleware, ISchemaValidationResponse } from '../middlewares'
import { isProductionENV } from '../../utils/environments'

export class ZodSchemaValidatorMiddleware extends SchemaValidationMiddleware<ZodSchema> {
  protected validate (data: unknown): ISchemaValidationResponse {
    const schema = this.schemaFactory()
    const result = schema.safeParse(data)
    const success = result.success

    if (!success) {
      const formattedErrors = this.formatErrors(result.error)

      return {
        success,
        validationsErrors: formattedErrors
      }
    }

    return {
      success
    }
  }

  private formatErrors (errors: ZodError) {
    return errors.issues.map(issue => {
      /* Don't expose (possibly sensitive) information about the error */
      const info = isProductionENV ? { path: issue.path, message: issue.message } : issue

      return {
        msg: `Validation error in ${issue.path.join('.')}`,
        info
      }
    })
  }
}
