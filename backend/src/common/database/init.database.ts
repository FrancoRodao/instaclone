import { Sequelize } from 'sequelize'
import { environment } from '../config/environment.config'
import { logger } from '../../utils/logger'

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  database: environment.dbName,
  username: environment.dbUsername,
  password: environment.dbPassword,
  logging: (msg: string) => logger.debug(msg)
})

export const databaseInit = async (): Promise<void> => {
  try {
    await sequelize.sync()
    await sequelize.authenticate()
    logger.info('Database connection has been established successfully.')
  } catch (error) {
    // TODO: SHUTDOWN NODE JS PROCESS
    logger.error(`Unable to connect to the database: ${error}`)
  }
}
