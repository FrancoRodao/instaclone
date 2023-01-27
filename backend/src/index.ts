// TODO: CREATE CONFIG ENV FUNCTION
// config environment
// eslint-disable-next-line import/no-duplicates
import './common/config/environment.config'

// init dependency container
// TODO: CREATE INIT CONTAINER FUNCTION
import 'reflect-metadata'
import './common/IOC/global.container'

import express from 'express'
import { ExpressServerAdapter } from './common/httpServer/express/expressServer.common'
import { databaseInit } from './common/database/init.database'
import { APIVersion1 } from './common/APIVersions/APIVersion1'
import { errorHandler } from './common/errors/errorHandler.common'
// eslint-disable-next-line import/no-duplicates
import { environment } from './common/config/environment.config'

databaseInit().then(() => {
  const app = new ExpressServerAdapter(express())
  const port = Number(environment.port || 3000)
  const apiVersion1 = new APIVersion1(app)

  app.init(port, apiVersion1)
})

// shutdowns server if something goes wrong
process.on('uncaughtException', (error: Error) => {
  errorHandler.handleUnexpectedError(error)

  if (!errorHandler.isTrustedError(error)) {
    process.exit(1)
  }
})
