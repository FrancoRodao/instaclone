import { injectable, inject } from 'tsyringe'
import { IControllerRequest, INextFunction } from '../httpServer/interfaces'
import { BaseMiddleware } from './middleware.interface'
import { I18NService } from '../i18n/i18n'
import { BadRequestError } from '../errors/errors.common'
import { isProductionENV } from '../../utils/environments'
import { globalContainerTypes } from '../IOC/types'

@injectable()
export class TranslationMiddleware extends BaseMiddleware {
  private I18NService: I18NService

  constructor (
    @inject(globalContainerTypes.I18NService) I18NService: I18NService
  ) {
    super()
    this.I18NService = I18NService
  }

  processRequest (req: IControllerRequest, next: INextFunction): void {
    // @ts-expect-error accept-language header undefined exception is controlled below
    const acceptLanguageHeader = req.headers['accept-language'] as string

    if (typeof acceptLanguageHeader !== 'string' || !acceptLanguageHeader) {
      throw new BadRequestError({
        msg: isProductionENV ? 'Error when translating' : 'accept-language header must be a string'
      })
    }

    if (!this.I18NService.isAvailableLanguage(acceptLanguageHeader)) {
      throw new BadRequestError({
        msg: isProductionENV ? 'Error when translating' : 'accept-language is not a valid language'
      })
    }

    // acceptLanguageHeader is a available language
    // @ts-expect-error
    this.I18NService.changeLanguage(acceptLanguageHeader)

    next()
  }
}
