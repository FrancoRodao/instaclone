import { I18NNextService } from '../i18n'
import { localeES } from '../locales/es'

describe('Testing I18NNextService', () => {
  const I18N = new I18NNextService()

  test('should translate fullName to spanish', () => {
    I18N.changeLanguage('es')
    expect(I18N.translate('fullName')).toBe(localeES.fullName)
  })

  test('should change to "en" language', () => {
    I18N.changeLanguage('en')
    expect(I18N.currentLanguage).toBe('en')
  })

  test('should change to "es" language', () => {
    I18N.changeLanguage('es')
    expect(I18N.currentLanguage).toBe('es')
  })

  test('"es" language must be an available language', () => {
    expect(I18N.isAvailableLanguage('es')).toBe(true)
  })

  test('"eN" (case insensitive) language must be an available language', () => {
    expect(I18N.isAvailableLanguage('eN')).toBe(true)
  })

  test('getLanguages method should return ["en", "es"]', () => {
    expect(I18N.getLanguages()).toStrictEqual(['en', 'es'])
  })
})
