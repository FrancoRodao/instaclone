/*
 Types must be in a separate file,
 otherwise dependency injection will not work.
*/

export const globalContainerTypes = {
  I18NService: 'I18NService',
  TranslationMiddleware: 'TranslationMiddleware'
}

export const authContainerTypes = {
  AuthService: 'AuthService',
  AuthTokenService: 'AuthTokenService',
  SignUpController: 'SignUpController',
  SignInController: 'SignInController'
}

export const usersContainerTypes = {
  UserRepository: 'UserRepository'
}
