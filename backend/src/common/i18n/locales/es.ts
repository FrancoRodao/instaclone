import { ITranslationStructure } from './translationsStructure'
/*
  ---= CONVECTION =---

  keywords of translation inside {{ }} and in uppercase
  need an interpolation value
*/

export const localeES: ITranslationStructure = {
  fullName: 'Nombre completo',

  errors: {
    '{{FIELD}}MustHaveAtLeast{{X}}Characters': '{{FIELD}} debe tener al menos {{X}} caracteres',
    EmailIsAlreadyRegistered: 'Este correo electrónico ya está registrado, por favor utilice otro',
    InvalidUserCredentials: 'Credenciales invalidas'
  }
}
