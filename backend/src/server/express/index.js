const routeConfig = require('express').Router()

const cors = require('cors')
const logger = require('morgan')


routeConfig.use(cors())
routeConfig.use(logger('dev'))


const v1 = require('./routes/v1')

routeConfig.use('/v1', v1)






//error handlers
routeConfig.use(function (err, req, res, next) {

    res.status(500).json({ error: true, message: err.message })
})



module.exports = routeConfig

