import { logger } from '../../utils/logger'
import { APIBaseError, ErrorsObjectInfo, UnexpectedError } from './errors.common'
import { isProductionENV } from '../../utils/environments'

interface HTTPErrorResponse{
    ok: boolean,
    status: number,
    errors: { data: ErrorsObjectInfo }
}

class APIErrorHandler {
  handleTrustedError (error: APIBaseError): HTTPErrorResponse {
    return {
      ok: false,
      status: error.httpCode || 500,
      errors: { data: error.errorInfo }
    }
  }

  handleUnexpectedError (error: Error): HTTPErrorResponse {
    // TODO: Inject logger as a dependency and add the test to make sure to call logger.error at least once
    logger.error(error.stack || 'failed to get error stack')

    const { name, httpCode, errorInfo } = new UnexpectedError({ msg: error.message, info: error })

    return {
      ok: false,
      status: httpCode,
      /* Don't expose (possibly sensitive) information about the error */
      errors: isProductionENV ? { data: [{ msg: name }] } : { data: errorInfo }
    }
  }

  isTrustedError (error: Error) {
    if (error instanceof APIBaseError) {
      return error.isOperational
    }

    return false
  }
}

export const apiErrorHandler = new APIErrorHandler()
