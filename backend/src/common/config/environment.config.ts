import dotenv from 'dotenv'
import path from 'path'
import { isDebugENV, isDevelopmentENV, isProductionENV, isTestENV } from '../../utils/environments'
import { logger } from '../../utils/logger'

function configEnv (relativePath: string) {
  const { error } = dotenv.config({
    path: path.resolve(__dirname, relativePath)
  })

  if (error) {
    logger.error(`Error configuring the environment ${error.stack}`)
    process.exit(1)
  }
}

if (isDevelopmentENV || isDebugENV || isTestENV) configEnv('../../../.env.development')

if (isProductionENV) configEnv('../../../.env.production')

export const environment = {
  port: process.env.PORT,

  dbHost: process.env.DATABASE_HOST,
  dbName: process.env.DATABASE_NAME,
  dbUsername: process.env.DATABASE_USERNAME,
  dbPassword: process.env.DATABASE_PASSWORD,

  SECRET_KEY: process.env.SECRET_KEY || ''
}

const keysWithErrors = Object.keys(environment).filter((k) => environment[k as keyof typeof environment] === undefined || null || '')

if (keysWithErrors.length) {
  logger.error(`There are problems with the following environment variables: ${keysWithErrors}`)
  process.exit(1)
}

// force to use environment variable
process.env = {}
