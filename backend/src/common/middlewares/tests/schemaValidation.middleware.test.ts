import 'reflect-metadata'
import { ISchemaValidationResponse, SchemaValidationMiddleware } from '../schemaValidation.middleware'
import { ValidationError } from '../../errors/errors.common'

// can be zod, yup, joi schema types
type schemaTypeMock = {
    validate(data: any): boolean
}

function userSchemaFactory (): schemaTypeMock {
  return {
    validate: function (data) {
      return typeof data?.body.user?.name === 'string'
    }
  }
}

class ConcreteSchemaValidationMiddleware extends SchemaValidationMiddleware<schemaTypeMock> {
  protected validate (data: unknown): ISchemaValidationResponse {
    const schema = this.schemaFactory()
    const isValidData = schema.validate(data)

    if (!isValidData) {
      return {
        success: false,
        validationsErrors: [
          {
            msg: 'user.name must be a string'
          }
        ]
      }
    }

    return {
      success: true
    }
  }
}

describe('Testing schemaValidationMiddleware class', () => {
  const concreteSchemaValidationMiddleware = new ConcreteSchemaValidationMiddleware(userSchemaFactory)
  const nextFunction = jest.fn()

  test('should validate the data correctly', () => {
    const request = {
      body: {
        user: {
          name: 'Franco'
        }
      }
    }

    expect(() => concreteSchemaValidationMiddleware.processRequest(request, nextFunction)).not.toThrowError()
    expect(nextFunction).toBeCalledTimes(1)
  })

  test('should not validate the data correctly and throw an error', () => {
    const request = {
      body: {
        user: {
          name: true
        }
      }
    }

    expect(() => concreteSchemaValidationMiddleware.processRequest(request, nextFunction)).toThrowError(ValidationError)
    expect(nextFunction).toBeCalledTimes(1)
  })
})
