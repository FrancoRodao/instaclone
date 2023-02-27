import 'reflect-metadata'
import { BadRequestError } from '../../errors/errors.common'
import { I18NNextService } from '../../i18n/i18n'
import { TranslationMiddleware } from '../translation.middleware'

const I18NService = new I18NNextService()
const translationMiddleware = new TranslationMiddleware(I18NService)

describe('Testing translation middleware class', () => {
  const nextFunction = jest.fn()

  test('should throw a bad request error because accept-language header is not a string', () => {
    const requestObj = {
      body: {},
      headers: {
        'accept-language': 999
      }
    }

    const processRequestFunc = () => translationMiddleware.processRequest(requestObj, nextFunction)

    expect(processRequestFunc).toThrowError(BadRequestError)
  })

  test('should throw a bad request error because accept-language header is undefined or null', () => {
    const requestObj = {
      body: {},
      headers: {}
    }
    const processRequestFunc = () => translationMiddleware.processRequest(requestObj, nextFunction)

    expect(processRequestFunc).toThrowError(BadRequestError)
  })

  test('should throw a bad request error because accept-language is not an available language', () => {
    const requestObj = {
      body: {},
      headers: {
        'accept-language': 'random language'
      }
    }

    const processRequestFunc = () => translationMiddleware.processRequest(requestObj, nextFunction)

    expect(processRequestFunc).toThrowError(BadRequestError)
  })

  test('should change language to "en"', () => {
    const langToChange = 'en'
    const requestObj = {
      body: {},
      headers: {
        'accept-language': langToChange
      }
    }

    translationMiddleware.processRequest(requestObj, nextFunction)

    expect(I18NService.currentLanguage).toBe(langToChange)
    expect(nextFunction).toBeCalledTimes(1)
  })
})
