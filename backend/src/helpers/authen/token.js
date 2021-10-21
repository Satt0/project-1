const jwt = require('jsonwebtoken')
const {errorFormater}=require('../format/error')
class TokenValidation {
    constructor() {
        this.key = process.env.JWT_PRIVATE_KEY;
        if (typeof this.key !== 'string') {
            throw new Error("no private key provided!")
        }
    }
    signJWT(data) {
        try {
            return jwt.sign(data, this.key)
        }
        catch ({message="error!"}) {
            return errorFormater(message)
        }


    }
    validateJWT(token) {

        try {
            return jwt.verify(token, this.key)
        } catch ({message="error!"}) {
            return errorFormater(message)
        }
    }
}

module.exports = { TokenValidation }