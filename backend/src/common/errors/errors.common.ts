/* eslint-disable no-unused-vars */
export enum HttpStatusCodes{
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500
}
/* eslint-enable no-unused-vars */

export type ErrorObjectInfo = { msg: string, info?: Object }
export type ErrorsObjectInfo = Array<ErrorObjectInfo>

// TODO: DOCUMENTATION ABOUT WHAT IS OPERATIONAL , name error etc

export class BaseError extends Error {
  readonly name: string
  readonly errorInfo: ErrorsObjectInfo
  readonly httpCode: HttpStatusCodes
  readonly isOperational: boolean

  constructor (name: string, errorInfo: ErrorsObjectInfo, httpCode: HttpStatusCodes, isOperational: boolean) {
    super(name)

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.errorInfo = errorInfo
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}

export class UnexpectedError extends BaseError {
  constructor (errorInfo: ErrorObjectInfo) {
    super('Unexpected error - Internal server', [errorInfo], HttpStatusCodes.INTERNAL_SERVER, false)
  }
}

export class ValidationError extends BaseError {
  constructor (errorInfo: ErrorsObjectInfo) {
    super('Validation error - Bad request', errorInfo, HttpStatusCodes.BAD_REQUEST, true)
  }
}

export class BadRequestError extends BaseError {
  constructor (errorInfo: ErrorObjectInfo) {
    super(`${errorInfo.msg} - Bad request`, [errorInfo], HttpStatusCodes.BAD_REQUEST, true)
  }
}
