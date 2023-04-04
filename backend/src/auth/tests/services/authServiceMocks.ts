import { I18NService, IAvailableLanguages } from '../../../common/i18n/i18n'
import { IUserService } from '../../../users/services/users.service'
import { IAuthTokenService } from '../../services'
import { localeEN } from '../../../common/i18n/locales/en'
import { localeES } from '../../../common/i18n/locales/es'

class I18NMock extends I18NService {
  protected defaultLanguage: IAvailableLanguages = 'en'
  protected availableLanguages = {
    en: {
      translationFile: localeEN
    },
    es: {
      translationFile: localeES
    }
  }

  currentLanguage: IAvailableLanguages = 'en'

  public translate (translationKey: string): string {
    throw new Error('Method not implemented.')
  }

  public getLanguages (): ('en' | 'es')[] {
    throw new Error('Method not implemented.')
  }

  public isAvailableLanguage (lang: string): boolean {
    throw new Error('Method not implemented.')
  }

  public changeLanguage (lang: 'en' | 'es'): void {
    throw new Error('Method not implemented.')
  }
}

export const I18NServiceMock = new I18NMock()
jest.spyOn(I18NServiceMock, 'translate').mockReturnValue('message translated')

export const tokenServiceMock: IAuthTokenService = {
  generateAuthToken: jest.fn()
}

export const userServiceMock: IUserService = {
  create: jest.fn(),
  isUserExists: jest.fn(),
  areValidUserCredentials: jest.fn()
}
