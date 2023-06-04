/*
 Types must be in a separate file,
 otherwise dependency injection will not work.
 (typescript/decorators issue)
*/

export const globalDITypes = {
  I18NService: 'I18NService',
  TranslationMiddleware: 'TranslationMiddleware'
}
