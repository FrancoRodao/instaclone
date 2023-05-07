// TODO: CREATE CONFIG ENV FUNCTION
// config environment
// eslint-disable-next-line import/no-duplicates
import './common/config/environment.config'

import 'reflect-metadata' // required for tsyringe
import { loadDependencyContainers } from './common/IOC/global.container'

import express from 'express'
import { ExpressServerAdapter } from './common/httpServer/express/expressServer.common'
import { databaseInit } from './common/database/init.database'
import { APIVersion1 } from './common/APIVersions/APIVersion1'
import { apiErrorHandler } from './common/errors/errorHandler.common'
// eslint-disable-next-line import/no-duplicates
import { environment } from './common/config/environment.config'
import { sequelizePostAssociations } from './posts/models/associations'
import { sequelizeUserAssociations } from './users/models/associations'

databaseInit().then(async () => {
  loadDependencyContainers()

  sequelizePostAssociations()
  sequelizeUserAssociations()

  const app = new ExpressServerAdapter(express())
  const port = Number(environment.port || 3000)
  const apiVersion1 = new APIVersion1(app)

  app.init(port, apiVersion1)
})

// shutdowns server if something goes wrong
process.on('uncaughtException', (error: Error) => {
  // TODO: FIX handleUnexpectedError doesn't log the error correctly
  console.log(error)
  apiErrorHandler.handleUnexpectedError(error)

  if (!apiErrorHandler.isTrustedError(error)) {
    process.exit(1)
  }
})
