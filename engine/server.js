require('dotenv').config()
require("fs")
var logger = require("./logger")

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  appConfig = require('./appConfig')

logger.init()

if (process.argv.length<3){
  logger.error(`a config file is expected, please run as: node ./server.js [path_to_config.json]`)
}
else{
  var configFilename = process.argv[2]
  const config = appConfig.createInstance(configFilename)

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/', express.static('public'))
  app.use('/api', express.static('public'))

  var healthRoute = require('./api/health/route')
  healthRoute(app)

  var inventoryRoute = require('./api/inventory/route')
  inventoryRoute(app)

  var indexRoute = require('./api/index/route')
  indexRoute(app)

  var messageRoute = require('./api/message/route')
  messageRoute(app)

  var behaviorsRoute = require('./api/behaviors/route')
  behaviorsRoute(app)

  const port = config.getPort()
  const appId = config.getAppId()
  app.listen(port)

  logger.info(`${appId} server started on:${port}`)
}
