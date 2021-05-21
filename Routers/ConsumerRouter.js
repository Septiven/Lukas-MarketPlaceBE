const express = require('express')
const Router = express.Router()

// Import Controller
const consumerController = require('./../Controllers/ConsumerController') 

Router.post('/Register', consumerController.Register)
Router.post('/Login', consumerController.Login)

module.exports = Router