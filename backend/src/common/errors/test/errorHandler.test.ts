import { APIBaseError } from '../errors.common'
import { apiErrorHandler } from '../errorHandler.common'
import { HttpStatusCodes } from '../../httpServer/interfaces'

describe('Testing api error handler class', () => {
  const unexpectedErrorMsg = 'Unexpected error :('

  describe('Testing error handling', () => {
    test('should handle a trusted error by returning not found error status code and error info', () => {
      const errorInfo = { data: 'something goes wrong' }

      const trustedError = new APIBaseError('an api error', [{
        msg: 'error msg',
        info: errorInfo
      }], HttpStatusCodes.NOT_FOUND, true)

      const errorHandled = apiErrorHandler.handleTrustedError(trustedError)

      expect(errorHandled.ok).toBe(false)
      expect(errorHandled.status).toBe(HttpStatusCodes.NOT_FOUND)
      expect(errorHandled.errors.data[0].info).toBe(errorInfo)
    })

    test('should handle untrusted (unexpected) error by returning internal server error status code', () => {
      const unexpectedError = new Error(unexpectedErrorMsg)

      const errorHandled = apiErrorHandler.handleUnexpectedError(unexpectedError)

      expect(errorHandled.ok).toBe(false)
      expect(errorHandled.status).toBe(HttpStatusCodes.INTERNAL_SERVER)
      expect(errorHandled.errors.data[0].msg).toBe(unexpectedErrorMsg)
    })
  })

  describe('Testing isTrustedError method', () => {
    test('isTrustedError method should return false because the error is not a trusted error', () => {
      const unexpectedError = new Error(unexpectedErrorMsg)

      expect(apiErrorHandler.isTrustedError(unexpectedError)).toBe(false)
    })

    test('isTrustedError method should return false because the error is not operational', () => {
      const noOperationalError = new APIBaseError('an api error', [{
        msg: 'error msg'
      }], HttpStatusCodes.INTERNAL_SERVER, false)

      expect(apiErrorHandler.isTrustedError(noOperationalError)).toBe(false)
    })

    test('isTrustedError method should return true because the error is an trusted operational error', () => {
      const operationalError = new APIBaseError('an api error', [{
        msg: 'error msg'
      }], HttpStatusCodes.INTERNAL_SERVER, true)

      expect(apiErrorHandler.isTrustedError(operationalError)).toBe(true)
    })
  })
})
