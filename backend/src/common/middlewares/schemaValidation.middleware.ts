import { ValidationError, ErrorsObjectInfo } from '../errors/errors.common'
import { IControllerRequest, INextFunction } from '../httpServer/interfaces/controller.interface'
import { BaseMiddleware } from './middleware.interface'

export type ISchemaValidationResponse = {
  success: boolean,
  validationsErrors?: ErrorsObjectInfo
}

export abstract class SchemaValidationMiddleware<SchemaType> extends BaseMiddleware {
  protected schemaFactory: (() => SchemaType)

  protected abstract validate(data: unknown): ISchemaValidationResponse

  /*
   a schema factory is needed due to translations,
   because if a request needs to change the language
   the schema must be built again.

   Otherwise the schema error messages always remain in the same language
   because the schema (including error messages that have the default language setting)
   were built when the server is first started.
  */
  constructor (schemaFactory: () => SchemaType) {
    super()

    if (!schemaFactory) {
      // TODO: RETURN MESSAGE IF ARE IN DEV MODE OTHERWISE RETURN FATAL ERROR
      throw new Error('SchemaFactory cannot be null ')
    }

    this.schemaFactory = schemaFactory

    /* returns a base middleware */
    return this
  }

  processRequest (req: IControllerRequest, next: INextFunction): void {
    const { success, validationsErrors } = this.validate({
      body: req.body
    })

    if (!success) {
      // TODO: ADD TRANSLATION TO 'Failed to extract error information'
      throw new ValidationError(validationsErrors || [{ msg: 'Failed to extract error information' }])
    }

    next()
  }
}
