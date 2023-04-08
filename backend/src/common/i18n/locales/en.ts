import { ITranslationStructure } from './translationsStructure'

/*
  ---= CONVECTION =---

  keywords of translation inside {{ }} and in uppercase
  need an interpolation value
*/

export const localeEN: ITranslationStructure = {
  fullName: 'Full name',

  errors: {
    '{{FIELD}}MustHaveAtLeast{{X}}Characters': '{{FIELD}} must have at least {{X}} characters',
    EmailIsAlreadyRegistered: 'This email is already registered, please use another one',
    InvalidUserCredentials: 'Invalid user credentials.'
  }
}
