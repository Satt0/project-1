const jwt = require('jsonwebtoken')

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

        } catch (e) {
            throw e
        }
    }
    validateJWT(token) {

        try {
            return jwt.verify(token, this.key)
        } catch (e) {
            throw e
        }
    }
}

module.exports = { TokenValidation }