const routeConfig = require('express').Router()

const cors = require('cors')
const logger = require('morgan')
const {errorFormater}=require('../../helpers/format/error')

routeConfig.use(cors())
routeConfig.use(logger('dev'))


const v1 = require('./routes/v1')

routeConfig.use('/v1', v1)






//error handlers
routeConfig.use(function (err, req, res, next) {
    
    res.status(400).json(errorFormater(err))
})



module.exports = routeConfig

