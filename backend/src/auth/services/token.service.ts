// TODO: abstract jwt
import jwt from 'jsonwebtoken'
import { environment } from '../../common/config/environment.config'
import { IUserDTO } from '../../users/dtos/User.dto'

type generateAuthTokenResponse = Promise<{
  accessToken: string,
  refreshToken: string
}>

export interface IAuthTokenService{
  generateAuthToken(user: IUserDTO): generateAuthTokenResponse
}

export class AuthTokenService implements IAuthTokenService {
  async generateAuthToken (user: IUserDTO): generateAuthTokenResponse {
    const [accessToken, refreshToken] = await this.generateAsyncAuthToken(user)

    return {
      accessToken,
      refreshToken
    }
  }

  private generateAsyncAuthToken (user: IUserDTO): Promise<[string, string]> {
    const accessToken = new Promise<string>((resolve, reject) => {
      jwt.sign(
        { user },
        environment.SECRET_KEY,
        { expiresIn: '5m' },
        (err, accessToken) => {
          if (err || !accessToken) reject(err)

          if (accessToken) resolve(accessToken)
        }
      )
    })

    const refreshToken = new Promise<string>((resolve, reject) => {
      jwt.sign(
        { user },
        environment.SECRET_KEY,
        { expiresIn: '30d' },
        async (err, refreshToken) => {
          if (err || !refreshToken) reject(err)

          // TODO: CREATE VALIDS REFRESH TOKENS
          // await new ValidTokens({ token: refreshToken }).save()

          if (refreshToken) resolve(refreshToken)
        }
      )
    })

    return Promise.all([accessToken, refreshToken])
  }
}
