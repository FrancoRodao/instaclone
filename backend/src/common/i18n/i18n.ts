import i18next, { Resource } from 'i18next'
import { localeEN, localeES } from './locales/index'
import { isDevelopmentENV } from '../../utils/environments'

type IAvailableLanguages = 'en' | 'es'

export abstract class I18NService {
  protected abstract defaultLanguage: IAvailableLanguages
  protected abstract availableLanguages: Record<IAvailableLanguages, {
    translationsFile: string | Object
  }>

  public abstract currentLanguage: IAvailableLanguages

  public abstract translate (translationKeys: string | string[], options?: Object): string
  public abstract getLanguages (): string[]
  public abstract isAvailableLanguage (lang: string): boolean
  public abstract changeLanguage (lang: IAvailableLanguages): void
}

export class I18NNextService extends I18NService {
  public currentLanguage: IAvailableLanguages = 'en'
  protected defaultLanguage: IAvailableLanguages = 'en'

  /*
   To add a new language just add one more element to the object
   with its translation file.
  */
  protected availableLanguages: Record<IAvailableLanguages, { translationsFile: Object }> = {
    en: {
      translationsFile: localeEN
    },
    es: {
      translationsFile: localeES
    }
  }

  constructor () {
    super()
    this.init()
  }

  /**
  ---= CONVECTION =---

  keywords of translation inside {{ }} and in uppercase
  need an interpolation value

  @example
  translate('{{FIELD}}MustHaveAtLeast{{X}}Characters', {FIELD: 'Full name', X: '5'})
  /*
    FIELD and X are interpolation value
    in this case 'FIELD='Full name' and X='5'
  /*
  */
  translate (keys: string | string[], options?: Object): string {
    return i18next.t(keys, options)
  }

  private async init () {
    // transform availableLanguages to i18next resources
    const resources: Resource = {}
    const resourcesKeys = Object.keys(this.availableLanguages) as IAvailableLanguages[]

    resourcesKeys.forEach((k: IAvailableLanguages) => {
      Object.defineProperty(resources, k, {
        value: {
          translation: this.availableLanguages[k].translationsFile
        }
      })
    })

    await i18next.init({
      fallbackLng: ['en', 'es'],
      debug: isDevelopmentENV,
      resources,
      saveMissing: true,
      parseMissingKeyHandler: () => '' // if a key doesn't exist '' will be returned instead
    })
  }

  getLanguages (): string[] {
    return Object.keys(this.availableLanguages)
  }

  // case insensitive
  isAvailableLanguage (lang: string): boolean {
    return this.getLanguages()
      .map(l => l.toLocaleLowerCase())
      .includes(lang.toLowerCase())
  }

  // case insensitive
  changeLanguage (lang: IAvailableLanguages) {
    const langFound = this.getLanguages().find(l => l.toLocaleLowerCase() === lang.toLocaleLowerCase())
    i18next.changeLanguage(langFound)
    this.currentLanguage = lang
  }
}
