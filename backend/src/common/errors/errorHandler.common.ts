import { logger } from '../../utils/logger'
import { BaseError, ErrorsObjectInfo, ErrorObjectInfo, UnexpectedError } from './errors.common'
import { isProductionENV } from '../../utils/environments'

interface HTTPErrorResponse{
    ok: boolean,
    status: number,
    errors: { data: ErrorsObjectInfo | ErrorObjectInfo }
}

class ErrorHandler {
  handleTrustedError (error: BaseError): HTTPErrorResponse {
    return {
      ok: false,
      status: error.httpCode | 500,
      errors: { data: error.errorInfo }
    }
  }

  handleUnexpectedError (error: Error): HTTPErrorResponse {
    logger.error(error.stack || 'failed to get error stack')

    const { name, httpCode, errorInfo } = new UnexpectedError({ msg: error.message, info: error })

    return {
      ok: false,
      status: httpCode,
      /* Don't expose (possibly sensitive) information about the error */
      errors: isProductionENV ? { data: { msg: name } } : { data: errorInfo }
    }
  }

  isTrustedError (error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }

    return false
  }
}

export const errorHandler = new ErrorHandler()
