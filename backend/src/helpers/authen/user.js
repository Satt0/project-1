const { TokenValidation } = require('./token')
const { errorFormater } = require('../format/error')
const validator = require('validator')

class UserAuthentication {
    constructor(jwt) {
        if (typeof jwt !== 'string')
            throw new Error("Bad JWT!");


        const validator = new TokenValidation();
        this.user = validator.validateJWT(jwt);

        if (typeof this.user !== 'object')
            throw new Error("Bad USER!");

    }
    authenUserIdentity() {
        try {
            const { id } = this.user;
            if (!validator.isNumeric(id + ''))
                 throw new Error("bad token");

            return id;
        } catch ({ message }) {
            return errorFormater(message)
        }
    }
    authenUserRole() {
        try {
            const { role } = this.user;
            
            if (!validator.isNumeric(role + ''))
                 throw new Error("bad token");

            return role;
        } catch ({ message }) {
            return errorFormater(message)
        }
    }

}







module.exports = { UserAuthentication }