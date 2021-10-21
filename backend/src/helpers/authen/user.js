const { TokenValidation } = require('./token')


class UserAuthentication {
    constructor(jwt) {
        if (typeof jwt !== 'string') {
            throw new Error("Bad JWT!")
        }

        const validator = new TokenValidation()
        this.user = validator.validateJWT(jwt)

    }
    authenUserIdentity() {
        return this.user?.id || -1
    }
    authenUserAuthorization() {
        return this.user?.role || -1
    }

}







module.exports = { UserAuthentication }